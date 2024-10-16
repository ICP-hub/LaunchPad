use ic_cdk::init;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::DefaultMemoryImpl;
use ic_stable_structures::StableBTreeMap;
use ic_stable_structures::{storable::Bound, Storable};
use candid::{Decode, Encode, Principal};
use std::cell::RefCell;
use std::borrow::Cow;

use crate::{CanisterIdWrapper, ImageIdWrapper, IndexCanisterIdWrapper, SaleDetailsWrapper, State, UserAccountWrapper};

pub type Memory = VirtualMemory<DefaultMemoryImpl>;
pub type CanisterIdsMap = StableBTreeMap<String, CanisterIdWrapper, Memory>;
pub type IndexCanisterIdsMap = StableBTreeMap<String, IndexCanisterIdWrapper, Memory>;
pub type ImageIdsMap = StableBTreeMap<String, ImageIdWrapper, Memory>;
pub type SaleDetailsMap = StableBTreeMap<String, SaleDetailsWrapper, Memory>;
pub type UserAccountsMap = StableBTreeMap<Principal, UserAccountWrapper, Memory>;

const CANISTER_IDS_MEMORY: MemoryId = MemoryId::new(0);
const INDEX_CANISTER_IDS_MEMORY: MemoryId = MemoryId::new(1);
const IMAGE_IDS_MEMORY: MemoryId = MemoryId::new(2);
const SALE_DETAILS_MEMORY: MemoryId = MemoryId::new(3);
const USER_ACCOUNTS_MEMORY: MemoryId = MemoryId::new(4);



thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    pub static STATE: RefCell<State> = RefCell::new(
        MEMORY_MANAGER.with(|mm| State {
            canister_ids: CanisterIdsMap::init(mm.borrow().get(CANISTER_IDS_MEMORY)),
            index_canister_ids: IndexCanisterIdsMap::init(mm.borrow().get(INDEX_CANISTER_IDS_MEMORY)),
            image_ids: ImageIdsMap::init(mm.borrow().get(IMAGE_IDS_MEMORY)),
            sale_details: SaleDetailsMap::init(mm.borrow().get(SALE_DETAILS_MEMORY)),
            user_accounts: UserAccountsMap::init(mm.borrow().get(USER_ACCOUNTS_MEMORY)),
        })
    );
}

pub fn read_state<R>(f: impl FnOnce(&State) -> R) -> R {
    STATE.with(|cell| f(&cell.borrow()))
}


pub fn mutate_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

pub fn get_canister_ids_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(CANISTER_IDS_MEMORY))
}

pub fn get_index_canister_ids_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(INDEX_CANISTER_IDS_MEMORY))
}

pub fn get_image_ids_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(IMAGE_IDS_MEMORY))
}

pub fn get_sale_details_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(SALE_DETAILS_MEMORY))
}

pub fn get_user_accounts_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(USER_ACCOUNTS_MEMORY))
}


#[init]
fn init() {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.canister_ids = init_canister_ids();
        state.index_canister_ids = init_index_canister_ids();
        state.image_ids = init_image_ids();
        state.sale_details = init_sale_details();
        state.user_accounts = init_user_accounts();
    });
}

impl State {
    pub fn new() -> Self {
        Self {
            canister_ids: init_canister_ids(),
            index_canister_ids : init_index_canister_ids(),
            image_ids: init_image_ids(),
            sale_details:init_sale_details(),
            user_accounts:init_user_accounts(),
        }
    }
}

impl Default for State {
    fn default() -> Self {
        State::new()
    }
}

pub fn init_canister_ids() -> CanisterIdsMap {
    CanisterIdsMap::init(get_canister_ids_memory())
}

pub fn init_index_canister_ids() -> IndexCanisterIdsMap {
    IndexCanisterIdsMap::init(get_index_canister_ids_memory())
}

pub fn init_image_ids() -> ImageIdsMap {
    ImageIdsMap::init(get_image_ids_memory())
}

pub fn init_sale_details() -> SaleDetailsMap {
    SaleDetailsMap::init(get_sale_details_memory())
}

pub fn init_user_accounts() -> UserAccountsMap {
    UserAccountsMap::init(get_user_accounts_memory())
}


impl Storable for CanisterIdWrapper {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for IndexCanisterIdWrapper {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for ImageIdWrapper {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for SaleDetailsWrapper {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for UserAccountWrapper {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}
