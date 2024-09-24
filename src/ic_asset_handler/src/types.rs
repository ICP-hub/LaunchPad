use base64::{engine::general_purpose, Engine};
use candid::{CandidType, Nat};
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;
use std::path::Path;
use url::Url;

use crate::{nat_to_u64, Bytes32, MAX_FILE_SIZE};

#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub struct FileInfo {
    pub id: u32,
    pub parent: u32, // 0: root
    pub name: String,
    pub content_type: String,
    pub size: Nat,
    pub filled: Nat,
    pub created_at: Nat, // unix timestamp in milliseconds
    pub updated_at: Nat, // unix timestamp in milliseconds
    pub chunks: u32,
    pub status: i8, // -1: archived; 0: readable and writable; 1: readonly
    pub hash: Option<ByteBuf>,
    pub ert: Option<String>, // External Resource Type
                             // ERT indicates that the file is an external resource. The content stored in the file includes a link to the external resource and other key information.
}

#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub struct CreateFileInput {
    // pub parent: u32,
    pub name: String,
    pub content_type: String,
    pub size: Option<Nat>, // if provided, can be used to detect the file is fully filled
    pub content: Option<ByteBuf>, // should <= 1024 * 1024 * 2 - 1024
    pub status: Option<i8>, // when set to 1, the file must be fully filled, and hash must be provided
    pub hash: Option<ByteBuf>, // recommend sha3 256
    pub ert: Option<String>,
    pub crc32: Option<u32>,
}


pub fn valid_file_name(name: &str) -> bool {
    if name.is_empty() || name.trim() != name || name.len() > 64 {
        return false;
    }

    let p = Path::new(name);
    p.file_name() == Some(p.as_os_str())
}

// pub fn valid_file_parent(parent: &str) -> bool {
//     if parent.is_empty() || parent == "/" {
//         return true;
//     }

//     if !parent.starts_with('/') {
//         return false;
//     }

//     for name in parent[1..].split('/') {
//         if !valid_file_name(name) {
//             return false;
//         }
//     }
//     true
// }

impl CreateFileInput {
    pub fn validate(&self) -> Result<(), String> {
        if !valid_file_name(&self.name) {
            return Err("invalid file name".to_string());
        }

        if self.content_type.is_empty() {
            return Err("content_type cannot be empty".to_string());
        }
        if let Some(content) = &self.content {
            if content.is_empty() {
                return Err("content cannot be empty".to_string());
            }
        }
        if let Some(size) = &self.size {
            let size = nat_to_u64(size);
            if size == 0 {
                return Err(format!("invalid size {:?}", &self.size));
            }

            if size > MAX_FILE_SIZE {
                return Err(format!("file size exceeds limit: {}", MAX_FILE_SIZE));
            }
        }

        if let Some(hash) = &self.hash {
            if hash.len() != 32 {
                return Err("hash must be 32 bytes".to_string());
            }
        }
        if let Some(status) = self.status {
            if !(0i8..=1i8).contains(&status) {
                return Err("status should be 0 or 1".to_string());
            }
        }
        Ok(())
    }
}

#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub struct CreateFileOutput {
    pub id: u32,
    // pub created_at: Nat,
}

#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub struct UpdateFileInput {
    pub id: u32,
    pub parent: Option<u32>,
    pub name: Option<String>,
    pub content_type: Option<String>,
    pub status: Option<i8>, // when set to 1, the file must be fully filled, and hash must be provided
    pub hash: Option<ByteBuf>,
    pub ert: Option<String>,
}

impl UpdateFileInput {
    pub fn validate(&self) -> Result<(), String> {
        if let Some(name) = &self.name {
            if !valid_file_name(name) {
                return Err("invalid file name".to_string());
            }
        }
        if let Some(content_type) = &self.content_type {
            if content_type.is_empty() {
                return Err("content_type cannot be empty".to_string());
            }
        }
        if let Some(hash) = &self.hash {
            if hash.len() != 32 {
                return Err("hash must be 32 bytes".to_string());
            }
        }
        if let Some(status) = self.status {
            if !(-1i8..=1i8).contains(&status) {
                return Err("status should be -1, 0 or 1".to_string());
            }
        }
        Ok(())
    }
}

#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub struct UpdateFileOutput {
    pub updated_at: Nat,
}

#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub struct UpdateFileChunkInput {
    pub id: u32,
    pub chunk_index: u32,
    pub content: ByteBuf, // should be in (0, 1024 * 256]
    pub crc32: Option<u32>,
}

#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub struct UpdateFileChunkOutput {
    pub filled: Nat,
    pub updated_at: Nat,
}

#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub struct FileChunk(pub u32, pub ByteBuf);

pub struct UrlFileParam {
    pub file: u32,
    pub hash: Option<Bytes32>,
    pub token: Option<ByteBuf>,
}

impl UrlFileParam {
  pub fn from_url(req_url: &str) -> Result<Self, String> {
      let url = if req_url.starts_with('/') {
          Url::parse(format!("http://localhost{}", req_url).as_str())
      } else {
          Url::parse(req_url)
      };
      let url = url.map_err(|_| format!("invalid url: {}", req_url))?;

      let mut param = match url.path() {
          path if path.starts_with("/f/") => Self {
              file: path[3..].parse().map_err(|_| "invalid file id")?,
              hash: None,
              token: None,
          },
          path if path.starts_with("/h/") => {
              let hash = Bytes32::try_from(&path[3..])?;
              Self {
                  file: 0,
                  hash: Some(hash),
                  token: None,
              }
          }
          path => return Err(format!("invalid request path: {}", path)),
      };

      if let Some(q) = url.query() {
          if !q.starts_with("token=") {
              return Err("invalid token".to_string());
          }
          let data = general_purpose::URL_SAFE_NO_PAD
              .decode(q[6..].as_bytes())
              .map_err(|_| format!("failed to decode base64 token from {}", &q[6..]))?;
          param.token = Some(ByteBuf::from(data));
      }

      Ok(param)
  }
}