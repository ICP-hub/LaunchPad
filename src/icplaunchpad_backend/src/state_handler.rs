use candid::{Decode, Encode, Principal};
use ic_cdk::init;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::DefaultMemoryImpl;
use ic_stable_structures::StableBTreeMap;
use ic_stable_structures::{storable::Bound, Storable};
use std::borrow::Cow;
use std::cell::RefCell;

use crate::{
    CanisterIdWrapper, CoverImageIdWrapper, ImageIdWrapper, IndexCanisterIdWrapper,
    SaleDetailsWrapper, State, U64Wrapper, UserAccountWrapper,
};

pub type Memory = VirtualMemory<DefaultMemoryImpl>;
pub type CanisterIdsMap = StableBTreeMap<String, CanisterIdWrapper, Memory>;
pub type IndexCanisterIdsMap = StableBTreeMap<String, IndexCanisterIdWrapper, Memory>;
pub type ImageIdsMap = StableBTreeMap<String, ImageIdWrapper, Memory>;
pub type SaleDetailsMap = StableBTreeMap<String, SaleDetailsWrapper, Memory>;
pub type UserAccountsMap = StableBTreeMap<Principal, UserAccountWrapper, Memory>;
pub type CoverImageIdsMap = StableBTreeMap<String, CoverImageIdWrapper, Memory>;
pub type FundsRaisedMap = StableBTreeMap<Principal, U64Wrapper, Memory>;
pub type ContributionsMap = StableBTreeMap<(Principal, Principal), U64Wrapper, Memory>;

const CANISTER_IDS_MEMORY: MemoryId = MemoryId::new(0);
const INDEX_CANISTER_IDS_MEMORY: MemoryId = MemoryId::new(1);
const IMAGE_IDS_MEMORY: MemoryId = MemoryId::new(2);
const SALE_DETAILS_MEMORY: MemoryId = MemoryId::new(3);
const USER_ACCOUNTS_MEMORY: MemoryId = MemoryId::new(4);
const COVER_IMAGE_IDS_MEMORY: MemoryId = MemoryId::new(5);
const FUNDS_RAISED_MEMORY: MemoryId = MemoryId::new(6);
const CONTRIBUTIONS_MEMORY: MemoryId = MemoryId::new(7);

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
            cover_image_ids: CoverImageIdsMap::init(mm.borrow().get(COVER_IMAGE_IDS_MEMORY)),
            funds_raised: FundsRaisedMap::init(mm.borrow().get(FUNDS_RAISED_MEMORY)),
            contributions: ContributionsMap::init(mm.borrow().get(CONTRIBUTIONS_MEMORY)),
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

pub fn get_cover_image_ids_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(COVER_IMAGE_IDS_MEMORY))
}

pub fn get_funds_raised_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(FUNDS_RAISED_MEMORY))
}

pub fn get_contributions_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(CONTRIBUTIONS_MEMORY))
}

#[init]
fn init() {
    STATE.with(|state| {
        *state.borrow_mut() = State::new();
    });
}

impl State {
    pub fn new() -> Self {
        Self {
            canister_ids: init_canister_ids(),
            index_canister_ids: init_index_canister_ids(),
            image_ids: init_image_ids(),
            sale_details: init_sale_details(),
            user_accounts: init_user_accounts(),
            cover_image_ids: init_cover_image_ids(),
            funds_raised: init_funds_raised_map(),
            contributions: init_contributions(),
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

pub fn init_cover_image_ids() -> CoverImageIdsMap {
    CoverImageIdsMap::init(get_cover_image_ids_memory())
}

pub fn init_funds_raised_map() -> FundsRaisedMap {
    FundsRaisedMap::init(get_funds_raised_memory())
}

pub fn init_contributions() -> ContributionsMap {
    ContributionsMap::init(get_contributions_memory())
}

impl Storable for U64Wrapper {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(self.0.to_le_bytes().to_vec())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        U64Wrapper(u64::from_le_bytes(bytes.as_ref().try_into().unwrap()))
    }

    const BOUND: Bound = Bound::Unbounded;
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

impl Storable for CoverImageIdWrapper {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}
