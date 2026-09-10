/* tslint:disable */
/* eslint-disable */
export function setPanicHook(): void;

export type ClvmType = Program | PublicKey | Signature | K1PublicKey | K1Signature | R1PublicKey | R1Signature | Remark | AggSigParent | AggSigPuzzle | AggSigAmount | AggSigPuzzleAmount | AggSigParentAmount | AggSigParentPuzzle | AggSigUnsafe | AggSigMe | CreateCoin | ReserveFee | CreateCoinAnnouncement | CreatePuzzleAnnouncement | AssertCoinAnnouncement | AssertPuzzleAnnouncement | AssertConcurrentSpend | AssertConcurrentPuzzle | AssertSecondsRelative | AssertSecondsAbsolute | AssertHeightRelative | AssertHeightAbsolute | AssertBeforeSecondsRelative | AssertBeforeSecondsAbsolute | AssertBeforeHeightRelative | AssertBeforeHeightAbsolute | AssertMyCoinId | AssertMyParentId | AssertMyPuzzleHash | AssertMyAmount | AssertMyBirthSeconds | AssertMyBirthHeight | AssertEphemeral | SendMessage | ReceiveMessage | Softfork | Pair | NftMetadata | HandleNftMetadata | CurriedProgram | MipsMemo | InnerPuzzleMemo | RestrictionMemo | WrapperMemo | Force1of2RestrictedVariableMemo | MemoKind | MemberMemo | MofNMemo | MeltSingleton | TransferNft | RunCatTail | UpdateNftMetadata | UpdateDatastoreMerkleRoot | OptionMetadata | NotarizedPayment | Payment | string | bigint | number | boolean | Uint8Array | null | undefined | ClvmType[];

export function mOfNHash(config: MemberConfig, required: number, items: Uint8Array[]): Uint8Array;
export function k1MemberHash(config: MemberConfig, publicKey: K1PublicKey, fastForward: boolean): Uint8Array;
export function r1MemberHash(config: MemberConfig, publicKey: R1PublicKey, fastForward: boolean): Uint8Array;
export function blsMemberHash(config: MemberConfig, publicKey: PublicKey, fastForward: boolean): Uint8Array;
export function passkeyMemberHash(config: MemberConfig, publicKey: R1PublicKey, fastForward: boolean): Uint8Array;
export function singletonMemberHash(config: MemberConfig, launcherId: Uint8Array, fastForward: boolean): Uint8Array;
export function fixedMemberHash(config: MemberConfig, fixedPuzzleHash: Uint8Array): Uint8Array;
export function customMemberHash(config: MemberConfig, innerHash: Uint8Array): Uint8Array;
export function timelockRestriction(timelock: bigint): Restriction;
export function force1Of2Restriction(leftSideSubtreeHash: Uint8Array, nonce: number, memberValidatorListHash: Uint8Array, delegatedPuzzleValidatorListHash: Uint8Array): Restriction;
export function preventConditionOpcodeRestriction(conditionOpcode: number): Restriction;
export function preventMultipleCreateCoinsRestriction(): Restriction;
export function preventVaultSideEffectsRestriction(): Restriction[];
export function wrappedDelegatedPuzzleHash(restrictions: Restriction[], delegatedPuzzleHash: Uint8Array): Uint8Array;
export function encodeOffer(spendBundle: SpendBundle): string;
export function decodeOffer(offer: string): SpendBundle;
export function standardPuzzleHash(syntheticKey: PublicKey): Uint8Array;
export function catPuzzleHash(assetId: Uint8Array, innerPuzzleHash: Uint8Array): Uint8Array;
export function bulletinPuzzleHash(hiddenPuzzleHash: Uint8Array): Uint8Array;
export function fromHex(value: string): Uint8Array;
export function toHex(value: Uint8Array): string;
export function bytesEqual(lhs: Uint8Array, rhs: Uint8Array): boolean;
export function treeHashAtom(atom: Uint8Array): Uint8Array;
export function treeHashPair(first: Uint8Array, rest: Uint8Array): Uint8Array;
export function sha256(value: Uint8Array): Uint8Array;
export function curryTreeHash(program: Uint8Array, args: Uint8Array[]): Uint8Array;
export function generateBytes(bytes: number): Uint8Array;
export function selectCoins(coins: Coin[], amount: bigint): Coin[];
export function spendBundleCost(coinSpends: CoinSpend[]): bigint;
export function xchandlesGetPrice(basePrice: bigint, handle: string, numPeriods: bigint): bigint;
export function singletonStructHash(launcherId: Uint8Array): Uint8Array;
export function xchandlesRegisterOwnerMessage(precommitPuzzleHash: Uint8Array): Uint8Array;
export function xchandlesExpireOwnerMessage(precommitPuzzleHash: Uint8Array): Uint8Array;
export function predictBlankHandleNftCoinId(launcherId: Uint8Array, syntheticPublicKey: PublicKey, royaltyPuzzleHash: Uint8Array, royaltyBasisPoints: number): Uint8Array;
export function xchandlesRegistrationDelegatedPuzzleHash(registryLauncherId: Uint8Array, precommitPuzzleHash: Uint8Array, p2PuzzleHash: Uint8Array, registrationTimestamp: bigint, currentExpiration: bigint, finalHandleNftMetadata: HandleNftMetadata): Uint8Array;

export class Spends {
    free(): void;
    __getClassname(): string;
    clone(): Spends;
    constructor(clvm: Clvm, changePuzzleHash: Uint8Array);
    addXch(coin: Coin): void;
    addCat(cat: Cat): void;
    addNft(nft: Nft): void;
    p2PuzzleHashes(): Uint8Array[];
    nonSettlementCoinIds(): Uint8Array[];
    addOptionalCondition(condition: Program): void;
    addRequiredCondition(condition: Program): void;
    disableSettlementAssertions(): void;
    selectedXchAmount(): bigint;
    selectedAssetIds(): Uint8Array[];
    selectedCatAmount(assetId: Uint8Array): bigint;
    apply(actions: Action[]): Deltas;
    prepare(deltas: Deltas): FinishedSpends;
}
export class FinishedSpends {
    free(): void;
    __getClassname(): string;
    clone(): FinishedSpends;
    pendingSpends(): PendingSpend[];
    insert(coinId: Uint8Array, spend: Spend): void;
    spend(): Outputs;
}
export class PendingSpend {
    free(): void;
    __getClassname(): string;
    clone(): PendingSpend;
    p2PuzzleHash(): Uint8Array;
    coin(): Coin;
    conditions(): Program[];
    asXch(): Coin | undefined;
    asCat(): Cat | undefined;
    asDid(): Did | undefined;
    asNft(): Nft | undefined;
    asOption(): OptionContract | undefined;
}
export class Action {
    free(): void;
    __getClassname(): string;
    clone(): Action;
    static send(id: Id, puzzleHash: Uint8Array, amount: bigint, memos?: Program | undefined): Action;
    static settle(id: Id, notarizedPayment: NotarizedPayment): Action;
    static issueCat(tailSpend: Spend, hiddenPuzzleHash: Uint8Array | undefined, amount: bigint): Action;
    static singleIssueCat(hiddenPuzzleHash: Uint8Array | undefined, amount: bigint): Action;
    static runTail(id: Id, tailSpend: Spend, supplyDelta: Delta): Action;
    static mintNft(clvm: Clvm, metadata: Program, metadataUpdaterPuzzleHash: Uint8Array, royaltyPuzzleHash: Uint8Array, royaltyBasisPoints: number, amount: bigint, parentId?: Id | undefined): Action;
    static updateNft(id: Id, metadataUpdateSpends: Spend[], transfer?: TransferNftById | undefined): Action;
    static fee(amount: bigint): Action;
}
export class Deltas {
    free(): void;
    __getClassname(): string;
    clone(): Deltas;
    static fromActions(actions: Action[]): Deltas;
    get(id: Id): Delta | undefined;
    isNeeded(id: Id): boolean;
    ids(): Id[];
}
export class Delta {
    free(): void;
    __getClassname(): string;
    clone(): Delta;
    constructor(input: bigint, output: bigint);
    input: bigint;
    output: bigint;
}
export class Id {
    free(): void;
    __getClassname(): string;
    clone(): Id;
    static xch(): Id;
    static existing(assetId: Uint8Array): Id;
    static new(index: usize): Id;
    isXch(): boolean;
    asExisting(): Uint8Array | undefined;
    asNew(): usize | undefined;
    equals(id: Id): boolean;
}
export class Outputs {
    free(): void;
    __getClassname(): string;
    clone(): Outputs;
    xch(): Coin[];
    cats(): Id[];
    cat(id: Id): Cat[];
    nfts(): Id[];
    nft(id: Id): Nft;
}
export class TransferNftById {
    free(): void;
    __getClassname(): string;
    clone(): TransferNftById;
    constructor(ownerId: Id | undefined, tradePrices: TradePrice[]);
    ownerId: Id | undefined;
    tradePrices: TradePrice[];
}
export class Address {
    free(): void;
    __getClassname(): string;
    clone(): Address;
    constructor(puzzleHash: Uint8Array, prefix: string);
    puzzleHash: Uint8Array;
    prefix: string;
    encode(): string;
    static decode(address: string): Address;
}
export class SecretKey {
    free(): void;
    __getClassname(): string;
    clone(): SecretKey;
    static fromSeed(seed: Uint8Array): SecretKey;
    static fromBytes(bytes: Uint8Array): SecretKey;
    toBytes(): Uint8Array;
    publicKey(): PublicKey;
    sign(message: Uint8Array): Signature;
    deriveUnhardened(index: number): SecretKey;
    deriveHardened(index: number): SecretKey;
    deriveUnhardenedPath(path: number[]): SecretKey;
    deriveHardenedPath(path: number[]): SecretKey;
    deriveSynthetic(): SecretKey;
    deriveSyntheticHidden(hiddenPuzzleHash: Uint8Array): SecretKey;
}
export class PublicKey {
    free(): void;
    __getClassname(): string;
    clone(): PublicKey;
    static infinity(): PublicKey;
    static aggregate(publicKeys: PublicKey[]): PublicKey;
    static aggregateVerify(publicKeys: PublicKey[], messages: Uint8Array[], signature: Signature): boolean;
    static fromBytes(bytes: Uint8Array): PublicKey;
    toBytes(): Uint8Array;
    verify(message: Uint8Array, signature: Signature): boolean;
    fingerprint(): number;
    isInfinity(): boolean;
    isValid(): boolean;
    deriveUnhardened(index: number): PublicKey;
    deriveUnhardenedPath(path: number[]): PublicKey;
    deriveSynthetic(): PublicKey;
    deriveSyntheticHidden(hiddenPuzzleHash: Uint8Array): PublicKey;
}
export class Signature {
    free(): void;
    __getClassname(): string;
    clone(): Signature;
    static infinity(): Signature;
    static aggregate(signatures: Signature[]): Signature;
    static fromBytes(bytes: Uint8Array): Signature;
    toBytes(): Uint8Array;
    isInfinity(): boolean;
    isValid(): boolean;
}
export class SlotNeigborsInfo {
    free(): void;
    __getClassname(): string;
    clone(): SlotNeigborsInfo;
    constructor(leftValue: Uint8Array, rightValue: Uint8Array);
    leftValue: Uint8Array;
    rightValue: Uint8Array;
}
export class CatalogSlotValue {
    free(): void;
    __getClassname(): string;
    clone(): CatalogSlotValue;
    counter: bigint;
    assetId: Uint8Array;
    neighbors: SlotNeigborsInfo;
    static new(counter: bigint, assetId: Uint8Array, leftAssetId: Uint8Array, rightAssetId: Uint8Array): CatalogSlotValue;
}
export class CatalogSlot {
    free(): void;
    __getClassname(): string;
    clone(): CatalogSlot;
    coin: Coin;
    proof: LineageProof;
    nonce: bigint;
    launcherId: Uint8Array;
    value: CatalogSlotValue;
    static new(proof: LineageProof, launcherId: Uint8Array, value: CatalogSlotValue): CatalogSlot;
    valueHash(): Uint8Array;
}
export class CatalogRegistryState {
    free(): void;
    __getClassname(): string;
    clone(): CatalogRegistryState;
    constructor(catMakerPuzzleHash: Uint8Array, registrationPrice: bigint);
    catMakerPuzzleHash: Uint8Array;
    registrationPrice: bigint;
}
export class CatalogRegistryConstants {
    free(): void;
    __getClassname(): string;
    clone(): CatalogRegistryConstants;
    launcherId: Uint8Array;
    royaltyAddress: Uint8Array;
    royaltyBasisPoints: number;
    precommitPayoutPuzzleHash: Uint8Array;
    relativeBlockHeight: number;
    priceSingletonLauncherId: Uint8Array;
    static get(testnet11: boolean): CatalogRegistryConstants;
    withPriceSingleton(priceSingletonLauncherId: Uint8Array): CatalogRegistryConstants;
    withLauncherId(launcherId: Uint8Array): CatalogRegistryConstants;
}
export class CatalogPrecommitValue {
    free(): void;
    __getClassname(): string;
    clone(): CatalogPrecommitValue;
    tailReveal: Program;
    initialInnerPuzzleHash: Uint8Array;
    paymentAssetId: Uint8Array;
    static withDefaultCatMaker(clvm: Clvm, paymentAssetId: Uint8Array, initialInnerPuzzleHash: Uint8Array, tailReveal: Program): CatalogPrecommitValue;
}
export class CatalogPrecommitCoin {
    free(): void;
    __getClassname(): string;
    clone(): CatalogPrecommitCoin;
    coin: Coin;
    assetId: Uint8Array;
    proof: LineageProof;
    innerPuzzleHash: Uint8Array;
    value: CatalogPrecommitValue;
    static new(clvm: Clvm, parentCoinId: Uint8Array, proof: LineageProof, assetId: Uint8Array, controllerSingletonLauncherId: Uint8Array, relativeBlockHeight: number, payoutPuzzleHash: Uint8Array, refundPuzzleHash: Uint8Array, value: CatalogPrecommitValue, precommitAmount: bigint): CatalogPrecommitCoin;
}
export class CatalogRegistryFinishedSpendResult {
    free(): void;
    __getClassname(): string;
    clone(): CatalogRegistryFinishedSpendResult;
    constructor(newCatalog: CatalogRegistry, signature: Signature);
    newCatalog: CatalogRegistry;
    signature: Signature;
}
export class CatalogRegistryLaunchResult {
    free(): void;
    __getClassname(): string;
    clone(): CatalogRegistryLaunchResult;
    constructor(securitySignature: Signature, securitySecretKey: SecretKey, catalog: CatalogRegistry, slots: CatalogSlot[], securityCoin: Coin);
    securitySignature: Signature;
    securitySecretKey: SecretKey;
    catalog: CatalogRegistry;
    slots: CatalogSlot[];
    securityCoin: Coin;
}
export class CatalogRegistry {
    free(): void;
    __getClassname(): string;
    clone(): CatalogRegistry;
    coin(): Coin;
    proof(): Proof;
    state(): CatalogRegistryState;
    constants(): CatalogRegistryConstants;
    innerPuzzleHash(): Uint8Array;
    puzzleHash(): Uint8Array;
    pendingCreatedSlots(): CatalogSlot[];
    pendingSignature(): Signature;
    finishSpend(): CatalogRegistryFinishedSpendResult;
    register(tailHash: Uint8Array, leftSlot: CatalogSlot, rightSlot: CatalogSlot, precommitCoin: CatalogPrecommitCoin, eveNftInnerSpend: Spend): Program[];
    refund(tailHash: Uint8Array, precommitCoin: CatalogPrecommitCoin, neighbors?: SlotNeigborsInfo | undefined, slot?: CatalogSlot | undefined): Program[];
    delegatedState(newState: CatalogRegistryState, otherSingletonInnerPuzzleHash: Uint8Array): Program[];
    actualNeighbors(newTailHash: Uint8Array, onChainLeftSlot: CatalogSlot, onChainRightSlot: CatalogSlot): CatalogRegistryActualNeighborsResult;
    actualSlot(slot: CatalogSlot): CatalogSlot;
}
export class CatalogRegistryActualNeighborsResult {
    free(): void;
    __getClassname(): string;
    clone(): CatalogRegistryActualNeighborsResult;
    constructor(leftSlot: CatalogSlot, rightSlot: CatalogSlot);
    leftSlot: CatalogSlot;
    rightSlot: CatalogSlot;
}
export class Clvm {
    free(): void;
    __getClassname(): string;
    clone(): Clvm;
    constructor();
    reset(): void;
    addCoinSpend(coinSpend: CoinSpend): void;
    spendCoin(coin: Coin, spend: Spend): void;
    coinSpends(): CoinSpend[];
    parse(program: string): Program;
    deserialize(value: Uint8Array): Program;
    deserializeWithBackrefs(value: Uint8Array): Program;
    cache(modHash: Uint8Array, value: Uint8Array): Program;
    alloc(value: ClvmType): Program;
    pair(first: Program, rest: Program): Program;
    nil(): Program;
    int(value: bigint): Program;
    boundCheckedNumber(value: number): Program;
    string(value: string): Program;
    bool(value: boolean): Program;
    atom(value: Uint8Array): Program;
    list(value: Program[]): Program;
    delegatedSpend(conditions: Program[]): Spend;
    standardSpend(syntheticKey: PublicKey, spend: Spend): Spend;
    spendStandardCoin(coin: Coin, syntheticKey: PublicKey, spend: Spend): void;
    settlementSpend(notarizedPayments: NotarizedPayment[]): Spend;
    spendSettlementCoin(coin: Coin, notarizedPayments: NotarizedPayment[]): void;
    spendCats(catSpends: CatSpend[]): Cat[];
    spendP2NextRewardDistributorEpoch(cat: Cat, info: P2NextRewardDistributorEpochCoinInfo, nextEpochStart: bigint, rewardDistributorInnerPuzzleHash: Uint8Array): CatSpend;
    mintNfts(parentCoinId: Uint8Array, nftMints: NftMint[]): MintedNfts;
    spendNft(nft: Nft, innerSpend: Spend): Nft;
    mintDatastore(parentCoinId: Uint8Array, metadata: DatastoreMetadata, ownerPuzzleHash: Uint8Array, delegatedPuzzles: DelegatedPuzzle[]): MintedDatastore;
    datastoreFromSpend(parentSpend: CoinSpend, delegatedPuzzles?: DelegatedPuzzle[] | undefined): Datastore | undefined;
    createEveDid(parentCoinId: Uint8Array, p2PuzzleHash: Uint8Array): CreatedDid;
    spendDid(did: Did, innerSpend: Spend): Did | undefined;
    spendOption(option: OptionContract, innerSpend: Spend): OptionContract | undefined;
    spendStreamedAsset(streamedAsset: StreamedAsset, paymentTime: bigint, clawback: boolean): void;
    mintVault(parentCoinId: Uint8Array, custodyHash: Uint8Array, memos: Program): VaultMint;
    createBulletin(parentCoinId: Uint8Array, hiddenPuzzleHash: Uint8Array, messages: BulletinMessage[]): CreatedBulletin;
    mipsSpend(coin: Coin, delegatedSpend: Spend): MipsSpend;
    nftMetadata(value: NftMetadata): Program;
    handleNftMetadata(value: HandleNftMetadata): Program;
    mipsMemo(value: MipsMemo): Program;
    innerPuzzleMemo(value: InnerPuzzleMemo): Program;
    restrictionMemo(value: RestrictionMemo): Program;
    wrapperMemo(value: WrapperMemo): Program;
    force1Of2RestrictedVariableMemo(value: Force1of2RestrictedVariableMemo): Program;
    memoKind(value: MemoKind): Program;
    memberMemo(value: MemberMemo): Program;
    mOfNMemo(value: MofNMemo): Program;
    remark(rest: Program): Program;
    aggSigParent(publicKey: PublicKey, message: Uint8Array): Program;
    aggSigPuzzle(publicKey: PublicKey, message: Uint8Array): Program;
    aggSigAmount(publicKey: PublicKey, message: Uint8Array): Program;
    aggSigPuzzleAmount(publicKey: PublicKey, message: Uint8Array): Program;
    aggSigParentAmount(publicKey: PublicKey, message: Uint8Array): Program;
    aggSigParentPuzzle(publicKey: PublicKey, message: Uint8Array): Program;
    aggSigUnsafe(publicKey: PublicKey, message: Uint8Array): Program;
    aggSigMe(publicKey: PublicKey, message: Uint8Array): Program;
    createCoin(puzzleHash: Uint8Array, amount: bigint, memos?: Program | undefined): Program;
    reserveFee(amount: bigint): Program;
    createCoinAnnouncement(message: Uint8Array): Program;
    createPuzzleAnnouncement(message: Uint8Array): Program;
    assertCoinAnnouncement(announcementId: Uint8Array): Program;
    assertPuzzleAnnouncement(announcementId: Uint8Array): Program;
    assertConcurrentSpend(coinId: Uint8Array): Program;
    assertConcurrentPuzzle(puzzleHash: Uint8Array): Program;
    assertSecondsRelative(seconds: bigint): Program;
    assertSecondsAbsolute(seconds: bigint): Program;
    assertHeightRelative(height: number): Program;
    assertHeightAbsolute(height: number): Program;
    assertBeforeSecondsRelative(seconds: bigint): Program;
    assertBeforeSecondsAbsolute(seconds: bigint): Program;
    assertBeforeHeightRelative(height: number): Program;
    assertBeforeHeightAbsolute(height: number): Program;
    assertMyCoinId(coinId: Uint8Array): Program;
    assertMyParentId(parentId: Uint8Array): Program;
    assertMyPuzzleHash(puzzleHash: Uint8Array): Program;
    assertMyAmount(amount: bigint): Program;
    assertMyBirthSeconds(seconds: bigint): Program;
    assertMyBirthHeight(height: number): Program;
    assertEphemeral(): Program;
    sendMessage(mode: number, message: Uint8Array, data: Program[]): Program;
    receiveMessage(mode: number, message: Uint8Array, data: Program[]): Program;
    softfork(cost: bigint, rest: Program): Program;
    meltSingleton(): Program;
    transferNft(launcherId: Uint8Array | undefined, tradePrices: TradePrice[], singletonInnerPuzzleHash?: Uint8Array | undefined): Program;
    runCatTail(program: Program, solution: Program): Program;
    updateNftMetadata(updaterPuzzleReveal: Program, updaterSolution: Program): Program;
    updateDatastoreMerkleRoot(newMerkleRoot: Uint8Array, memos: Uint8Array[]): Program;
    parseChildStreamedAsset(coinSpend: CoinSpend): StreamedAssetParsingResult;
    parseChildMedievalVault(coinSpend: CoinSpend): MedievalVault | undefined;
    spendMedievalVault(medievalVault: MedievalVault, usedPubkeys: PublicKey[], conditions: Program[], genesisChallenge: Uint8Array): void;
    spendMedievalVaultUnsafe(medievalVault: MedievalVault, usedPubkeys: PublicKey[], delegatedSpend: Spend): void;
    medievalVaultRekeyDelegatedPuzzle(launcherId: Uint8Array, newM: usize, newPubkeys: PublicKey[], coinId: Uint8Array, genesisChallenge: Uint8Array): Program;
    medievalVaultSendMessageDelegatedPuzzle(prefixAndMessage: Uint8Array, receiverLauncherId: Uint8Array, myCoin: Coin, myInfo: MedievalVaultInfo, genesisChallenge: Uint8Array): Program;
    rewardDistributorFromSpend(spend: CoinSpend, reserveLineageProof: LineageProof | undefined, constants: RewardDistributorConstants): RewardDistributor | undefined;
    rewardDistributorFromParentSpend(parentSpend: CoinSpend, constants: RewardDistributorConstants): RewardDistributor | undefined;
    rewardDistributorFromEveCoinSpend(constants: RewardDistributorConstants, initialState: RewardDistributorState, eveCoinSpend: CoinSpend, reserveParentId: Uint8Array, reserveLineageProof: LineageProof): RewardDistributorInfoFromEveCoin | undefined;
    launchRewardDistributor(offer: SpendBundle, firstEpochStart: bigint, catRefundPuzzleHash: Uint8Array, constants: RewardDistributorConstants, mainnet: boolean, comment: string): RewardDistributorLaunchResult;
    rewardDistributorFromMempoolItem(mempoolItem: SpendBundle, constants: RewardDistributorConstants): RewardDistributor | undefined;
    catalogRegistryFromSpend(spend: CoinSpend, constants: CatalogRegistryConstants): CatalogRegistry | undefined;
    catalogRegistryFromParentSpend(parentSpend: CoinSpend, constants: CatalogRegistryConstants): CatalogRegistry | undefined;
    catalogRegistryFromMempoolItem(mempoolItem: SpendBundle, constants: CatalogRegistryConstants): CatalogRegistry | undefined;
    launchCatalogRegistry(offer: SpendBundle, initialRegistrationPrice: bigint, constants: CatalogRegistryConstants, initialRegistrationAssetId: Uint8Array, mainnet: boolean): CatalogRegistryLaunchResult;
    xchandlesRegistryFromSpend(spend: CoinSpend, constants: XchandlesConstants): XchandlesRegistry | undefined;
    xchandlesRegistryFromParentSpend(parentSpend: CoinSpend, constants: XchandlesConstants): XchandlesRegistry | undefined;
    xchandlesRegistryFromMempoolItem(mempoolItem: SpendBundle, constants: XchandlesConstants): XchandlesRegistry | undefined;
    launchXchandlesRegistry(offer: SpendBundle, initialBaseRegistrationPrice: bigint, initialRegistrationPeriod: bigint, constants: XchandlesConstants, initialRegistrationAssetId: Uint8Array, mainnet: boolean): XchandlesRegistryLaunchResult;
    createOfferSecurityCoin(offer: SpendBundle): OfferSecurityCoinDetails;
    createSecurityCoinWithPk(xchSettlementCoin: Coin, publicKey: PublicKey): Coin;
    createOfferSecurityCoinWithKey(offer: SpendBundle, securityCoinSk: SecretKey): OfferSecurityCoinDetails;
    spendOfferSecurityCoin(securityCoinDetails: OfferSecurityCoinDetails, conditions: Program[], mainnet: boolean): Signature;
    spendSettlementNft(offer: SpendBundle, nftLauncherId: Uint8Array, nonce: Uint8Array, destinationPuzzleHash: Uint8Array): SettlementNftSpendResult;
    offerSettlementCats(offer: SpendBundle, assetId: Uint8Array): Cat[];
    offerSettlementNft(offer: SpendBundle, nftLauncherId: Uint8Array): Nft | undefined;
    spendSettlementCats(offer: SpendBundle, assetId: Uint8Array, nonce: Uint8Array, payments: Payment[]): SpendSettlementCatsResult;
    stateSchedulerLayer(receiverSingletonStructHash: Uint8Array, prefixAndMessage: Uint8Array, innerPuzzle: Program): Program;
    acsTransferProgram(): Program;
    augmentedCondition(): Program;
    blockProgramZero(): Program;
    catPuzzle(): Program;
    chialispDeserialisation(): Program;
    conditionsWFeeAnnounce(): Program;
    covenantLayer(): Program;
    createNftLauncherFromDid(): Program;
    credentialRestriction(): Program;
    daoCatEve(): Program;
    daoCatLauncher(): Program;
    daoFinishedState(): Program;
    daoLockup(): Program;
    daoProposal(): Program;
    daoProposalTimer(): Program;
    daoProposalValidator(): Program;
    daoSpendP2Singleton(): Program;
    daoTreasury(): Program;
    daoUpdateProposal(): Program;
    decompressCoinSpendEntry(): Program;
    decompressCoinSpendEntryWithPrefix(): Program;
    decompressPuzzle(): Program;
    delegatedTail(): Program;
    didInnerpuzzle(): Program;
    emlCovenantMorpher(): Program;
    emlTransferProgramCovenantAdapter(): Program;
    emlUpdateMetadataWithDid(): Program;
    everythingWithSignature(): Program;
    exigentMetadataLayer(): Program;
    flagProofsChecker(): Program;
    genesisByCoinId(): Program;
    genesisByCoinIdOrSingleton(): Program;
    genesisByPuzzleHash(): Program;
    graftrootDlOffers(): Program;
    nftIntermediateLauncher(): Program;
    nftMetadataUpdaterDefault(): Program;
    nftMetadataUpdaterUpdateable(): Program;
    nftOwnershipLayer(): Program;
    nftOwnershipTransferProgramOneWayClaimWithRoyalties(): Program;
    nftStateLayer(): Program;
    notification(): Program;
    p21OfN(): Program;
    p2AnnouncedDelegatedPuzzle(): Program;
    p2Conditions(): Program;
    p2DelegatedConditions(): Program;
    p2DelegatedPuzzle(): Program;
    p2DelegatedPuzzleOrHiddenPuzzle(): Program;
    p2MOfNDelegateDirect(): Program;
    p2Parent(): Program;
    p2PuzzleHash(): Program;
    p2Singleton(): Program;
    p2SingletonAggregator(): Program;
    p2SingletonOrDelayedPuzzleHash(): Program;
    p2SingletonViaDelegatedPuzzle(): Program;
    poolMemberInnerpuzzle(): Program;
    poolWaitingroomInnerpuzzle(): Program;
    revocationLayer(): Program;
    romBootstrapGenerator(): Program;
    settlementPayment(): Program;
    singletonLauncher(): Program;
    singletonTopLayer(): Program;
    singletonTopLayerV11(): Program;
    standardVcRevocationPuzzle(): Program;
    stdParentMorpher(): Program;
    optionContract(): Program;
    p2CurriedPuzzle(): Program;
    blsMember(): Program;
    blsTaprootMember(): Program;
    fixedPuzzleMember(): Program;
    k1MemberPuzzleAssert(): Program;
    k1Member(): Program;
    passkeyMemberPuzzleAssert(): Program;
    passkeyMember(): Program;
    r1MemberPuzzleAssert(): Program;
    r1Member(): Program;
    singletonMember(): Program;
    enforceDelegatedPuzzleWrappers(): Program;
    force1Of2RestrictedVariable(): Program;
    forceAssertCoinAnnouncement(): Program;
    forceCoinMessage(): Program;
    preventConditionOpcode(): Program;
    preventMultipleCreateCoins(): Program;
    timelock(): Program;
    addDelegatedPuzzleWrapper(): Program;
    delegatedPuzzleFeeder(): Program;
    restrictions(): Program;
    indexWrapper(): Program;
    mOfN(): Program;
    nOfN(): Program;
    oneOfN(): Program;
    anyMetadataUpdater(): Program;
    stateSchedulerPuzzle(): Program;
}
export class Output {
    free(): void;
    __getClassname(): string;
    clone(): Output;
    constructor(value: Program, cost: bigint);
    value: Program;
    cost: bigint;
}
export class Pair {
    free(): void;
    __getClassname(): string;
    clone(): Pair;
    constructor(first: Program, rest: Program);
    first: Program;
    rest: Program;
}
export class CurriedProgram {
    free(): void;
    __getClassname(): string;
    clone(): CurriedProgram;
    constructor(program: Program, args: Program[]);
    program: Program;
    args: Program[];
}
export class Proof {
    free(): void;
    __getClassname(): string;
    clone(): Proof;
    constructor(parentParentCoinInfo: Uint8Array, parentInnerPuzzleHash: Uint8Array | undefined, parentAmount: bigint);
    parentParentCoinInfo: Uint8Array;
    parentInnerPuzzleHash: Uint8Array | undefined;
    parentAmount: bigint;
    toLineageProof(): LineageProof | undefined;
}
export class LineageProof {
    free(): void;
    __getClassname(): string;
    clone(): LineageProof;
    constructor(parentParentCoinInfo: Uint8Array, parentInnerPuzzleHash: Uint8Array, parentAmount: bigint);
    parentParentCoinInfo: Uint8Array;
    parentInnerPuzzleHash: Uint8Array;
    parentAmount: bigint;
    toProof(): Proof;
}
export class OfferSecurityCoinDetails {
    free(): void;
    __getClassname(): string;
    clone(): OfferSecurityCoinDetails;
    constructor(securityCoin: Coin, securityCoinSk: SecretKey);
    securityCoin: Coin;
    securityCoinSk: SecretKey;
}
export class SettlementNftSpendResult {
    free(): void;
    __getClassname(): string;
    clone(): SettlementNftSpendResult;
    constructor(newNft: Nft, securityConditions: Program[]);
    newNft: Nft;
    securityConditions: Program[];
}
export class SpendSettlementCatsResult {
    free(): void;
    __getClassname(): string;
    clone(): SpendSettlementCatsResult;
    constructor(createdCats: Cat[], securityConditions: Program[]);
    createdCats: Cat[];
    securityConditions: Program[];
}
export class Coin {
    free(): void;
    __getClassname(): string;
    clone(): Coin;
    constructor(parentCoinInfo: Uint8Array, puzzleHash: Uint8Array, amount: bigint);
    parentCoinInfo: Uint8Array;
    puzzleHash: Uint8Array;
    amount: bigint;
    coinId(): Uint8Array;
}
export class CoinSpend {
    free(): void;
    __getClassname(): string;
    clone(): CoinSpend;
    constructor(coin: Coin, puzzleReveal: Uint8Array, solution: Uint8Array);
    coin: Coin;
    puzzleReveal: Uint8Array;
    solution: Uint8Array;
}
export class SpendBundle {
    free(): void;
    __getClassname(): string;
    clone(): SpendBundle;
    constructor(coinSpends: CoinSpend[], aggregatedSignature: Signature);
    coinSpends: CoinSpend[];
    aggregatedSignature: Signature;
    toBytes(): Uint8Array;
    static fromBytes(bytes: Uint8Array): SpendBundle;
    hash(): Uint8Array;
}
export class CoinState {
    free(): void;
    __getClassname(): string;
    clone(): CoinState;
    constructor(coin: Coin, spentHeight?: number | undefined, createdHeight?: number | undefined);
    coin: Coin;
    spentHeight: number | undefined;
    createdHeight: number | undefined;
}
export class Spend {
    free(): void;
    __getClassname(): string;
    clone(): Spend;
    constructor(puzzle: Program, solution: Program);
    puzzle: Program;
    solution: Program;
}
export class Remark {
    free(): void;
    __getClassname(): string;
    clone(): Remark;
    constructor(rest: Program);
    rest: Program;
}
export class AggSigParent {
    free(): void;
    __getClassname(): string;
    clone(): AggSigParent;
    constructor(publicKey: PublicKey, message: Uint8Array);
    publicKey: PublicKey;
    message: Uint8Array;
}
export class AggSigPuzzle {
    free(): void;
    __getClassname(): string;
    clone(): AggSigPuzzle;
    constructor(publicKey: PublicKey, message: Uint8Array);
    publicKey: PublicKey;
    message: Uint8Array;
}
export class AggSigAmount {
    free(): void;
    __getClassname(): string;
    clone(): AggSigAmount;
    constructor(publicKey: PublicKey, message: Uint8Array);
    publicKey: PublicKey;
    message: Uint8Array;
}
export class AggSigPuzzleAmount {
    free(): void;
    __getClassname(): string;
    clone(): AggSigPuzzleAmount;
    constructor(publicKey: PublicKey, message: Uint8Array);
    publicKey: PublicKey;
    message: Uint8Array;
}
export class AggSigParentAmount {
    free(): void;
    __getClassname(): string;
    clone(): AggSigParentAmount;
    constructor(publicKey: PublicKey, message: Uint8Array);
    publicKey: PublicKey;
    message: Uint8Array;
}
export class AggSigParentPuzzle {
    free(): void;
    __getClassname(): string;
    clone(): AggSigParentPuzzle;
    constructor(publicKey: PublicKey, message: Uint8Array);
    publicKey: PublicKey;
    message: Uint8Array;
}
export class AggSigUnsafe {
    free(): void;
    __getClassname(): string;
    clone(): AggSigUnsafe;
    constructor(publicKey: PublicKey, message: Uint8Array);
    publicKey: PublicKey;
    message: Uint8Array;
}
export class AggSigMe {
    free(): void;
    __getClassname(): string;
    clone(): AggSigMe;
    constructor(publicKey: PublicKey, message: Uint8Array);
    publicKey: PublicKey;
    message: Uint8Array;
}
export class CreateCoin {
    free(): void;
    __getClassname(): string;
    clone(): CreateCoin;
    constructor(puzzleHash: Uint8Array, amount: bigint, memos?: Program | undefined);
    puzzleHash: Uint8Array;
    amount: bigint;
    memos: Program | undefined;
}
export class ReserveFee {
    free(): void;
    __getClassname(): string;
    clone(): ReserveFee;
    constructor(amount: bigint);
    amount: bigint;
}
export class CreateCoinAnnouncement {
    free(): void;
    __getClassname(): string;
    clone(): CreateCoinAnnouncement;
    constructor(message: Uint8Array);
    message: Uint8Array;
}
export class CreatePuzzleAnnouncement {
    free(): void;
    __getClassname(): string;
    clone(): CreatePuzzleAnnouncement;
    constructor(message: Uint8Array);
    message: Uint8Array;
}
export class AssertCoinAnnouncement {
    free(): void;
    __getClassname(): string;
    clone(): AssertCoinAnnouncement;
    constructor(announcementId: Uint8Array);
    announcementId: Uint8Array;
}
export class AssertPuzzleAnnouncement {
    free(): void;
    __getClassname(): string;
    clone(): AssertPuzzleAnnouncement;
    constructor(announcementId: Uint8Array);
    announcementId: Uint8Array;
}
export class AssertConcurrentSpend {
    free(): void;
    __getClassname(): string;
    clone(): AssertConcurrentSpend;
    constructor(coinId: Uint8Array);
    coinId: Uint8Array;
}
export class AssertConcurrentPuzzle {
    free(): void;
    __getClassname(): string;
    clone(): AssertConcurrentPuzzle;
    constructor(puzzleHash: Uint8Array);
    puzzleHash: Uint8Array;
}
export class AssertSecondsRelative {
    free(): void;
    __getClassname(): string;
    clone(): AssertSecondsRelative;
    constructor(seconds: bigint);
    seconds: bigint;
}
export class AssertSecondsAbsolute {
    free(): void;
    __getClassname(): string;
    clone(): AssertSecondsAbsolute;
    constructor(seconds: bigint);
    seconds: bigint;
}
export class AssertHeightRelative {
    free(): void;
    __getClassname(): string;
    clone(): AssertHeightRelative;
    constructor(height: number);
    height: number;
}
export class AssertHeightAbsolute {
    free(): void;
    __getClassname(): string;
    clone(): AssertHeightAbsolute;
    constructor(height: number);
    height: number;
}
export class AssertBeforeSecondsRelative {
    free(): void;
    __getClassname(): string;
    clone(): AssertBeforeSecondsRelative;
    constructor(seconds: bigint);
    seconds: bigint;
}
export class AssertBeforeSecondsAbsolute {
    free(): void;
    __getClassname(): string;
    clone(): AssertBeforeSecondsAbsolute;
    constructor(seconds: bigint);
    seconds: bigint;
}
export class AssertBeforeHeightRelative {
    free(): void;
    __getClassname(): string;
    clone(): AssertBeforeHeightRelative;
    constructor(height: number);
    height: number;
}
export class AssertBeforeHeightAbsolute {
    free(): void;
    __getClassname(): string;
    clone(): AssertBeforeHeightAbsolute;
    constructor(height: number);
    height: number;
}
export class AssertMyCoinId {
    free(): void;
    __getClassname(): string;
    clone(): AssertMyCoinId;
    constructor(coinId: Uint8Array);
    coinId: Uint8Array;
}
export class AssertMyParentId {
    free(): void;
    __getClassname(): string;
    clone(): AssertMyParentId;
    constructor(parentId: Uint8Array);
    parentId: Uint8Array;
}
export class AssertMyPuzzleHash {
    free(): void;
    __getClassname(): string;
    clone(): AssertMyPuzzleHash;
    constructor(puzzleHash: Uint8Array);
    puzzleHash: Uint8Array;
}
export class AssertMyAmount {
    free(): void;
    __getClassname(): string;
    clone(): AssertMyAmount;
    constructor(amount: bigint);
    amount: bigint;
}
export class AssertMyBirthSeconds {
    free(): void;
    __getClassname(): string;
    clone(): AssertMyBirthSeconds;
    constructor(seconds: bigint);
    seconds: bigint;
}
export class AssertMyBirthHeight {
    free(): void;
    __getClassname(): string;
    clone(): AssertMyBirthHeight;
    constructor(height: number);
    height: number;
}
export class AssertEphemeral {
    free(): void;
    __getClassname(): string;
    clone(): AssertEphemeral;
    constructor();
}
export class SendMessage {
    free(): void;
    __getClassname(): string;
    clone(): SendMessage;
    constructor(mode: number, message: Uint8Array, data: Program[]);
    mode: number;
    message: Uint8Array;
    data: Program[];
}
export class ReceiveMessage {
    free(): void;
    __getClassname(): string;
    clone(): ReceiveMessage;
    constructor(mode: number, message: Uint8Array, data: Program[]);
    mode: number;
    message: Uint8Array;
    data: Program[];
}
export class Softfork {
    free(): void;
    __getClassname(): string;
    clone(): Softfork;
    constructor(cost: bigint, rest: Program);
    cost: bigint;
    rest: Program;
}
export class MeltSingleton {
    free(): void;
    __getClassname(): string;
    clone(): MeltSingleton;
    constructor();
}
export class TransferNft {
    free(): void;
    __getClassname(): string;
    clone(): TransferNft;
    constructor(launcherId: Uint8Array | undefined, tradePrices: TradePrice[], singletonInnerPuzzleHash?: Uint8Array | undefined);
    launcherId: Uint8Array | undefined;
    tradePrices: TradePrice[];
    singletonInnerPuzzleHash: Uint8Array | undefined;
}
export class RunCatTail {
    free(): void;
    __getClassname(): string;
    clone(): RunCatTail;
    constructor(program: Program, solution: Program);
    program: Program;
    solution: Program;
}
export class UpdateNftMetadata {
    free(): void;
    __getClassname(): string;
    clone(): UpdateNftMetadata;
    constructor(updaterPuzzleReveal: Program, updaterSolution: Program);
    updaterPuzzleReveal: Program;
    updaterSolution: Program;
}
export class UpdateDatastoreMerkleRoot {
    free(): void;
    __getClassname(): string;
    clone(): UpdateDatastoreMerkleRoot;
    constructor(newMerkleRoot: Uint8Array, memos: Uint8Array[]);
    newMerkleRoot: Uint8Array;
    memos: Uint8Array[];
}
export class TradePrice {
    free(): void;
    __getClassname(): string;
    clone(): TradePrice;
    constructor(amount: bigint, puzzleHash: Uint8Array);
    amount: bigint;
    puzzleHash: Uint8Array;
}
export class Constants {
    free(): void;
    __getClassname(): string;
    clone(): Constants;
    static acsTransferProgram(): Uint8Array;
    static acsTransferProgramHash(): Uint8Array;
    static augmentedCondition(): Uint8Array;
    static augmentedConditionHash(): Uint8Array;
    static blockProgramZero(): Uint8Array;
    static blockProgramZeroHash(): Uint8Array;
    static catPuzzle(): Uint8Array;
    static catPuzzleHash(): Uint8Array;
    static chialispDeserialisation(): Uint8Array;
    static chialispDeserialisationHash(): Uint8Array;
    static conditionsWFeeAnnounce(): Uint8Array;
    static conditionsWFeeAnnounceHash(): Uint8Array;
    static covenantLayer(): Uint8Array;
    static covenantLayerHash(): Uint8Array;
    static createNftLauncherFromDid(): Uint8Array;
    static createNftLauncherFromDidHash(): Uint8Array;
    static credentialRestriction(): Uint8Array;
    static credentialRestrictionHash(): Uint8Array;
    static daoCatEve(): Uint8Array;
    static daoCatEveHash(): Uint8Array;
    static daoCatLauncher(): Uint8Array;
    static daoCatLauncherHash(): Uint8Array;
    static daoFinishedState(): Uint8Array;
    static daoFinishedStateHash(): Uint8Array;
    static daoLockup(): Uint8Array;
    static daoLockupHash(): Uint8Array;
    static daoProposal(): Uint8Array;
    static daoProposalHash(): Uint8Array;
    static daoProposalTimer(): Uint8Array;
    static daoProposalTimerHash(): Uint8Array;
    static daoProposalValidator(): Uint8Array;
    static daoProposalValidatorHash(): Uint8Array;
    static daoSpendP2Singleton(): Uint8Array;
    static daoSpendP2SingletonHash(): Uint8Array;
    static daoTreasury(): Uint8Array;
    static daoTreasuryHash(): Uint8Array;
    static daoUpdateProposal(): Uint8Array;
    static daoUpdateProposalHash(): Uint8Array;
    static decompressCoinSpendEntry(): Uint8Array;
    static decompressCoinSpendEntryHash(): Uint8Array;
    static decompressCoinSpendEntryWithPrefix(): Uint8Array;
    static decompressCoinSpendEntryWithPrefixHash(): Uint8Array;
    static decompressPuzzle(): Uint8Array;
    static decompressPuzzleHash(): Uint8Array;
    static delegatedTail(): Uint8Array;
    static delegatedTailHash(): Uint8Array;
    static didInnerpuzzle(): Uint8Array;
    static didInnerpuzzleHash(): Uint8Array;
    static emlCovenantMorpher(): Uint8Array;
    static emlCovenantMorpherHash(): Uint8Array;
    static emlTransferProgramCovenantAdapter(): Uint8Array;
    static emlTransferProgramCovenantAdapterHash(): Uint8Array;
    static emlUpdateMetadataWithDid(): Uint8Array;
    static emlUpdateMetadataWithDidHash(): Uint8Array;
    static everythingWithSignature(): Uint8Array;
    static everythingWithSignatureHash(): Uint8Array;
    static exigentMetadataLayer(): Uint8Array;
    static exigentMetadataLayerHash(): Uint8Array;
    static flagProofsChecker(): Uint8Array;
    static flagProofsCheckerHash(): Uint8Array;
    static genesisByCoinId(): Uint8Array;
    static genesisByCoinIdHash(): Uint8Array;
    static genesisByCoinIdOrSingleton(): Uint8Array;
    static genesisByCoinIdOrSingletonHash(): Uint8Array;
    static genesisByPuzzleHash(): Uint8Array;
    static genesisByPuzzleHashHash(): Uint8Array;
    static graftrootDlOffers(): Uint8Array;
    static graftrootDlOffersHash(): Uint8Array;
    static nftIntermediateLauncher(): Uint8Array;
    static nftIntermediateLauncherHash(): Uint8Array;
    static nftMetadataUpdaterDefault(): Uint8Array;
    static nftMetadataUpdaterDefaultHash(): Uint8Array;
    static nftMetadataUpdaterUpdateable(): Uint8Array;
    static nftMetadataUpdaterUpdateableHash(): Uint8Array;
    static nftOwnershipLayer(): Uint8Array;
    static nftOwnershipLayerHash(): Uint8Array;
    static nftOwnershipTransferProgramOneWayClaimWithRoyalties(): Uint8Array;
    static nftOwnershipTransferProgramOneWayClaimWithRoyaltiesHash(): Uint8Array;
    static nftStateLayer(): Uint8Array;
    static nftStateLayerHash(): Uint8Array;
    static notification(): Uint8Array;
    static notificationHash(): Uint8Array;
    static p21OfN(): Uint8Array;
    static p21OfNHash(): Uint8Array;
    static p2AnnouncedDelegatedPuzzle(): Uint8Array;
    static p2AnnouncedDelegatedPuzzleHash(): Uint8Array;
    static p2Conditions(): Uint8Array;
    static p2ConditionsHash(): Uint8Array;
    static p2DelegatedConditions(): Uint8Array;
    static p2DelegatedConditionsHash(): Uint8Array;
    static p2DelegatedPuzzle(): Uint8Array;
    static p2DelegatedPuzzleHash(): Uint8Array;
    static p2DelegatedPuzzleOrHiddenPuzzle(): Uint8Array;
    static p2DelegatedPuzzleOrHiddenPuzzleHash(): Uint8Array;
    static p2MOfNDelegateDirect(): Uint8Array;
    static p2MOfNDelegateDirectHash(): Uint8Array;
    static p2Parent(): Uint8Array;
    static p2ParentHash(): Uint8Array;
    static p2PuzzleHash(): Uint8Array;
    static p2PuzzleHashHash(): Uint8Array;
    static p2Singleton(): Uint8Array;
    static p2SingletonHash(): Uint8Array;
    static p2SingletonAggregator(): Uint8Array;
    static p2SingletonAggregatorHash(): Uint8Array;
    static p2SingletonOrDelayedPuzzleHash(): Uint8Array;
    static p2SingletonOrDelayedPuzzleHashHash(): Uint8Array;
    static p2SingletonViaDelegatedPuzzle(): Uint8Array;
    static p2SingletonViaDelegatedPuzzleHash(): Uint8Array;
    static poolMemberInnerpuzzle(): Uint8Array;
    static poolMemberInnerpuzzleHash(): Uint8Array;
    static poolWaitingroomInnerpuzzle(): Uint8Array;
    static poolWaitingroomInnerpuzzleHash(): Uint8Array;
    static revocationLayer(): Uint8Array;
    static revocationLayerHash(): Uint8Array;
    static romBootstrapGenerator(): Uint8Array;
    static romBootstrapGeneratorHash(): Uint8Array;
    static settlementPayment(): Uint8Array;
    static settlementPaymentHash(): Uint8Array;
    static singletonLauncher(): Uint8Array;
    static singletonLauncherHash(): Uint8Array;
    static singletonTopLayer(): Uint8Array;
    static singletonTopLayerHash(): Uint8Array;
    static singletonTopLayerV11(): Uint8Array;
    static singletonTopLayerV11Hash(): Uint8Array;
    static standardVcRevocationPuzzle(): Uint8Array;
    static standardVcRevocationPuzzleHash(): Uint8Array;
    static stdParentMorpher(): Uint8Array;
    static stdParentMorpherHash(): Uint8Array;
    static optionContract(): Uint8Array;
    static optionContractHash(): Uint8Array;
    static p2CurriedPuzzle(): Uint8Array;
    static p2CurriedPuzzleHash(): Uint8Array;
    static blsMember(): Uint8Array;
    static blsMemberHash(): Uint8Array;
    static blsTaprootMember(): Uint8Array;
    static blsTaprootMemberHash(): Uint8Array;
    static fixedPuzzleMember(): Uint8Array;
    static fixedPuzzleMemberHash(): Uint8Array;
    static k1MemberPuzzleAssert(): Uint8Array;
    static k1MemberPuzzleAssertHash(): Uint8Array;
    static k1Member(): Uint8Array;
    static k1MemberHash(): Uint8Array;
    static passkeyMemberPuzzleAssert(): Uint8Array;
    static passkeyMemberPuzzleAssertHash(): Uint8Array;
    static passkeyMember(): Uint8Array;
    static passkeyMemberHash(): Uint8Array;
    static r1MemberPuzzleAssert(): Uint8Array;
    static r1MemberPuzzleAssertHash(): Uint8Array;
    static r1Member(): Uint8Array;
    static r1MemberHash(): Uint8Array;
    static singletonMember(): Uint8Array;
    static singletonMemberHash(): Uint8Array;
    static enforceDelegatedPuzzleWrappers(): Uint8Array;
    static enforceDelegatedPuzzleWrappersHash(): Uint8Array;
    static force1Of2RestrictedVariable(): Uint8Array;
    static force1Of2RestrictedVariableHash(): Uint8Array;
    static forceAssertCoinAnnouncement(): Uint8Array;
    static forceAssertCoinAnnouncementHash(): Uint8Array;
    static forceCoinMessage(): Uint8Array;
    static forceCoinMessageHash(): Uint8Array;
    static preventConditionOpcode(): Uint8Array;
    static preventConditionOpcodeHash(): Uint8Array;
    static preventMultipleCreateCoins(): Uint8Array;
    static preventMultipleCreateCoinsHash(): Uint8Array;
    static timelock(): Uint8Array;
    static timelockHash(): Uint8Array;
    static addDelegatedPuzzleWrapper(): Uint8Array;
    static addDelegatedPuzzleWrapperHash(): Uint8Array;
    static delegatedPuzzleFeeder(): Uint8Array;
    static delegatedPuzzleFeederHash(): Uint8Array;
    static restrictions(): Uint8Array;
    static restrictionsHash(): Uint8Array;
    static indexWrapper(): Uint8Array;
    static indexWrapperHash(): Uint8Array;
    static mOfN(): Uint8Array;
    static mOfNHash(): Uint8Array;
    static nOfN(): Uint8Array;
    static nOfNHash(): Uint8Array;
    static oneOfN(): Uint8Array;
    static oneOfNHash(): Uint8Array;
    static anyMetadataUpdater(): Uint8Array;
    static anyMetadataUpdaterHash(): Uint8Array;
    static stateSchedulerPuzzle(): Uint8Array;
    static stateSchedulerPuzzleHash(): Uint8Array;
}
export class MerkleProof {
    free(): void;
    __getClassname(): string;
    clone(): MerkleProof;
    constructor(path: number, proof: Uint8Array[]);
    path: number;
    proof: Uint8Array[];
}
export class Vault {
    free(): void;
    __getClassname(): string;
    clone(): Vault;
    constructor(coin: Coin, proof: Proof, info: VaultInfo);
    coin: Coin;
    proof: Proof;
    info: VaultInfo;
    child(custodyHash: Uint8Array, amount: bigint): Vault;
}
export class VaultInfo {
    free(): void;
    __getClassname(): string;
    clone(): VaultInfo;
    constructor(launcherId: Uint8Array, custodyHash: Uint8Array);
    launcherId: Uint8Array;
    custodyHash: Uint8Array;
}
export class MemberConfig {
    free(): void;
    __getClassname(): string;
    clone(): MemberConfig;
    topLevel: boolean;
    nonce: number;
    restrictions: Restriction[];
    constructor();
    withTopLevel(topLevel: boolean): MemberConfig;
    withNonce(nonce: number): MemberConfig;
    withRestrictions(restrictions: Restriction[]): MemberConfig;
}
export class Restriction {
    free(): void;
    __getClassname(): string;
    clone(): Restriction;
    constructor(kind: RestrictionKind, puzzleHash: Uint8Array);
    kind: RestrictionKind;
    puzzleHash: Uint8Array;
}
export enum RestrictionKind {
    MemberCondition = 0,
    DelegatedPuzzleHash = 1,
    DelegatedPuzzleWrapper = 2,
}
export class MipsSpend {
    free(): void;
    __getClassname(): string;
    clone(): MipsSpend;
    spend(custodyHash: Uint8Array): Spend;
    spendVault(vault: Vault): void;
    mOfN(config: MemberConfig, required: number, items: Uint8Array[]): void;
    k1Member(config: MemberConfig, publicKey: K1PublicKey, signature: K1Signature, fastForward: boolean): void;
    r1Member(config: MemberConfig, publicKey: R1PublicKey, signature: R1Signature, fastForward: boolean): void;
    blsMember(config: MemberConfig, publicKey: PublicKey, fastForward: boolean): void;
    passkeyMember(config: MemberConfig, publicKey: R1PublicKey, signature: R1Signature, authenticatorData: Uint8Array, clientDataJson: Uint8Array, challengeIndex: number, fastForward: boolean): void;
    singletonMember(config: MemberConfig, launcherId: Uint8Array, fastForward: boolean, singletonInnerPuzzleHash: Uint8Array, singletonAmount: bigint): void;
    fixedPuzzleMember(config: MemberConfig, fixedPuzzleHash: Uint8Array): void;
    customMember(config: MemberConfig, spend: Spend): void;
    timelock(timelock: bigint): void;
    force1Of2RestrictedVariable(leftSideSubtreeHash: Uint8Array, nonce: number, memberValidatorListHash: Uint8Array, delegatedPuzzleValidatorListHash: Uint8Array, newRightSideMemberHash: Uint8Array): void;
    preventConditionOpcode(conditionOpcode: number): void;
    preventMultipleCreateCoins(): void;
    preventVaultSideEffects(): void;
}
export class VaultMint {
    free(): void;
    __getClassname(): string;
    clone(): VaultMint;
    constructor(vault: Vault, parentConditions: Program[]);
    vault: Vault;
    parentConditions: Program[];
}
export class MipsMemo {
    free(): void;
    __getClassname(): string;
    clone(): MipsMemo;
    constructor(innerPuzzle: InnerPuzzleMemo);
    innerPuzzle: InnerPuzzleMemo;
    innerPuzzleHash(): Uint8Array;
}
export class InnerPuzzleMemo {
    free(): void;
    __getClassname(): string;
    clone(): InnerPuzzleMemo;
    constructor(nonce: number, restrictions: RestrictionMemo[], kind: MemoKind);
    nonce: number;
    restrictions: RestrictionMemo[];
    kind: MemoKind;
    innerPuzzleHash(topLevel: boolean): Uint8Array;
}
export class RestrictionMemo {
    free(): void;
    __getClassname(): string;
    clone(): RestrictionMemo;
    constructor(memberConditionValidator: boolean, puzzleHash: Uint8Array, memo: Program);
    memberConditionValidator: boolean;
    puzzleHash: Uint8Array;
    memo: Program;
    static force1Of2RestrictedVariable(clvm: Clvm, leftSideSubtreeHash: Uint8Array, nonce: number, memberValidatorListHash: Uint8Array, delegatedPuzzleValidatorListHash: Uint8Array): RestrictionMemo;
    static enforceDelegatedPuzzleWrappers(clvm: Clvm, wrapperMemos: WrapperMemo[]): RestrictionMemo;
    static timelock(clvm: Clvm, seconds: bigint, reveal: boolean): RestrictionMemo;
}
export class WrapperMemo {
    free(): void;
    __getClassname(): string;
    clone(): WrapperMemo;
    constructor(puzzleHash: Uint8Array, memo: Program);
    puzzleHash: Uint8Array;
    memo: Program;
    static preventVaultSideEffects(clvm: Clvm, reveal: boolean): WrapperMemo[];
    static forceCoinAnnouncement(clvm: Clvm): WrapperMemo;
    static forceCoinMessage(clvm: Clvm): WrapperMemo;
    static preventMultipleCreateCoins(clvm: Clvm): WrapperMemo;
    static timelock(clvm: Clvm, seconds: bigint, reveal: boolean): WrapperMemo;
    static preventConditionOpcode(clvm: Clvm, opcode: number, reveal: boolean): WrapperMemo;
}
export class Force1of2RestrictedVariableMemo {
    free(): void;
    __getClassname(): string;
    clone(): Force1of2RestrictedVariableMemo;
    constructor(leftSideSubtreeHash: Uint8Array, nonce: number, memberValidatorListHash: Uint8Array, delegatedPuzzleValidatorListHash: Uint8Array);
    leftSideSubtreeHash: Uint8Array;
    nonce: number;
    memberValidatorListHash: Uint8Array;
    delegatedPuzzleValidatorListHash: Uint8Array;
}
export class MemoKind {
    free(): void;
    __getClassname(): string;
    clone(): MemoKind;
    static member(member: MemberMemo): MemoKind;
    static mOfN(mOfN: MofNMemo): MemoKind;
    asMember(): MemberMemo | undefined;
    asMOfN(): MofNMemo | undefined;
    innerPuzzleHash(): Uint8Array;
}
export class MemberMemo {
    free(): void;
    __getClassname(): string;
    clone(): MemberMemo;
    constructor(puzzleHash: Uint8Array, memo: Program);
    puzzleHash: Uint8Array;
    memo: Program;
    static k1(clvm: Clvm, publicKey: K1PublicKey, fastForward: boolean, reveal: boolean): MemberMemo;
    static r1(clvm: Clvm, publicKey: R1PublicKey, fastForward: boolean, reveal: boolean): MemberMemo;
    static bls(clvm: Clvm, publicKey: PublicKey, fastForward: boolean, taproot: boolean, reveal: boolean): MemberMemo;
    static passkey(clvm: Clvm, publicKey: R1PublicKey, fastForward: boolean, reveal: boolean): MemberMemo;
    static singleton(clvm: Clvm, launcherId: Uint8Array, fastForward: boolean, reveal: boolean): MemberMemo;
    static fixedPuzzle(clvm: Clvm, puzzleHash: Uint8Array, reveal: boolean): MemberMemo;
}
export class MofNMemo {
    free(): void;
    __getClassname(): string;
    clone(): MofNMemo;
    constructor(required: number, items: InnerPuzzleMemo[]);
    required: number;
    items: InnerPuzzleMemo[];
    innerPuzzleHash(): Uint8Array;
}
export class MipsMemoContext {
    free(): void;
    __getClassname(): string;
    clone(): MipsMemoContext;
    constructor();
    addK1(publicKey: K1PublicKey): void;
    addR1(publicKey: R1PublicKey): void;
    addBls(publicKey: PublicKey): void;
    addHash(hash: Uint8Array): void;
    addTimelock(timelock: bigint): void;
    addOpcode(opcode: number): void;
    addSingletonMode(mode: number): void;
}
export class Mnemonic {
    free(): void;
    __getClassname(): string;
    clone(): Mnemonic;
    constructor(mnemonic: string);
    static fromEntropy(entropy: Uint8Array): Mnemonic;
    static generate(use24: boolean): Mnemonic;
    static verify(mnemonic: string): boolean;
    toString(): string;
    toEntropy(): Uint8Array;
    toSeed(password: string): Uint8Array;
}
export class NotarizedPayment {
    free(): void;
    __getClassname(): string;
    clone(): NotarizedPayment;
    constructor(nonce: Uint8Array, payments: Payment[]);
    nonce: Uint8Array;
    payments: Payment[];
}
export class Payment {
    free(): void;
    __getClassname(): string;
    clone(): Payment;
    constructor(puzzleHash: Uint8Array, amount: bigint, memos?: Program | undefined);
    puzzleHash: Uint8Array;
    amount: bigint;
    memos: Program | undefined;
}
export class Program {
    free(): void;
    __getClassname(): string;
    clone(): Program;
    compile(): Output;
    unparse(): string;
    serialize(): Uint8Array;
    serializeWithBackrefs(): Uint8Array;
    run(solution: Program, maxCost: bigint, mempoolMode: boolean): Output;
    curry(args: Program[]): Program;
    uncurry(): CurriedProgram | undefined;
    treeHash(): Uint8Array;
    isAtom(): boolean;
    isPair(): boolean;
    isNull(): boolean;
    length(): number;
    first(): Program;
    rest(): Program;
    toInt(): bigint | undefined;
    toBoundCheckedNumber(): number | undefined;
    toString(): string | undefined;
    toBool(): boolean | undefined;
    toAtom(): Uint8Array | undefined;
    toList(): Program[] | undefined;
    toArgList(): Program[] | undefined;
    toPair(): Pair | undefined;
    puzzle(): Puzzle;
    parseNftMetadata(): NftMetadata | undefined;
    parseHandleNftMetadata(): HandleNftMetadata | undefined;
    parseRemark(): Remark | undefined;
    parseAggSigParent(): AggSigParent | undefined;
    parseAggSigPuzzle(): AggSigPuzzle | undefined;
    parseAggSigAmount(): AggSigAmount | undefined;
    parseAggSigPuzzleAmount(): AggSigPuzzleAmount | undefined;
    parseAggSigParentAmount(): AggSigParentAmount | undefined;
    parseAggSigParentPuzzle(): AggSigParentPuzzle | undefined;
    parseAggSigUnsafe(): AggSigUnsafe | undefined;
    parseAggSigMe(): AggSigMe | undefined;
    parseCreateCoin(): CreateCoin | undefined;
    parseReserveFee(): ReserveFee | undefined;
    parseCreateCoinAnnouncement(): CreateCoinAnnouncement | undefined;
    parseCreatePuzzleAnnouncement(): CreatePuzzleAnnouncement | undefined;
    parseAssertCoinAnnouncement(): AssertCoinAnnouncement | undefined;
    parseAssertPuzzleAnnouncement(): AssertPuzzleAnnouncement | undefined;
    parseAssertConcurrentSpend(): AssertConcurrentSpend | undefined;
    parseAssertConcurrentPuzzle(): AssertConcurrentPuzzle | undefined;
    parseAssertSecondsRelative(): AssertSecondsRelative | undefined;
    parseAssertSecondsAbsolute(): AssertSecondsAbsolute | undefined;
    parseAssertHeightRelative(): AssertHeightRelative | undefined;
    parseAssertHeightAbsolute(): AssertHeightAbsolute | undefined;
    parseAssertBeforeSecondsRelative(): AssertBeforeSecondsRelative | undefined;
    parseAssertBeforeSecondsAbsolute(): AssertBeforeSecondsAbsolute | undefined;
    parseAssertBeforeHeightRelative(): AssertBeforeHeightRelative | undefined;
    parseAssertBeforeHeightAbsolute(): AssertBeforeHeightAbsolute | undefined;
    parseAssertMyCoinId(): AssertMyCoinId | undefined;
    parseAssertMyParentId(): AssertMyParentId | undefined;
    parseAssertMyPuzzleHash(): AssertMyPuzzleHash | undefined;
    parseAssertMyAmount(): AssertMyAmount | undefined;
    parseAssertMyBirthSeconds(): AssertMyBirthSeconds | undefined;
    parseAssertMyBirthHeight(): AssertMyBirthHeight | undefined;
    parseAssertEphemeral(): AssertEphemeral | undefined;
    parseSendMessage(): SendMessage | undefined;
    parseReceiveMessage(): ReceiveMessage | undefined;
    parseSoftfork(): Softfork | undefined;
    parseMeltSingleton(): MeltSingleton | undefined;
    parseTransferNft(): TransferNft | undefined;
    parseRunCatTail(): RunCatTail | undefined;
    parseUpdateNftMetadata(): UpdateNftMetadata | undefined;
    parseUpdateDatastoreMerkleRoot(): UpdateDatastoreMerkleRoot | undefined;
    parseOptionMetadata(): OptionMetadata | undefined;
    parsePayment(): Payment | undefined;
    parseNotarizedPayment(): NotarizedPayment | undefined;
    parseRewardDistributorLauncherSolution(launcherCoin: Coin): RewardDistributorLauncherSolutionInfo | undefined;
}
export class Puzzle {
    free(): void;
    __getClassname(): string;
    clone(): Puzzle;
    constructor(puzzleHash: Uint8Array, program: Program, modHash: Uint8Array, args?: Program | undefined);
    puzzleHash: Uint8Array;
    program: Program;
    modHash: Uint8Array;
    args: Program | undefined;
    parseCatInfo(): ParsedCatInfo | undefined;
    parseCat(coin: Coin, solution: Program): ParsedCat | undefined;
    parseChildCats(parentCoin: Coin, parentSolution: Program): Cat[] | undefined;
    parseNftInfo(): ParsedNftInfo | undefined;
    parseNft(coin: Coin, solution: Program): ParsedNft | undefined;
    parseChildNft(parentCoin: Coin, parentSolution: Program): Nft | undefined;
    parseDidInfo(): ParsedDidInfo | undefined;
    parseDid(coin: Coin, solution: Program): ParsedDid | undefined;
    parseChildDid(parentCoin: Coin, parentSolution: Program, coin: Coin): Did | undefined;
    parseOptionInfo(): ParsedOptionInfo | undefined;
    parseOption(coin: Coin, solution: Program): ParsedOption | undefined;
    parseChildOption(parentCoin: Coin, parentSolution: Program): OptionContract | undefined;
    parseInnerStreamingPuzzle(): StreamingPuzzleInfo | undefined;
    parseChildClawbacks(parentSolution: Program): Clawback[] | undefined;
    parseBulletin(coin: Coin, solution: Program): ParsedBulletin | undefined;
    parseChildP2Parent(parentCoin: Coin, parentSolution: Program): P2ParentCoinChildParseResult | undefined;
}
export class StreamedAssetParsingResult {
    free(): void;
    __getClassname(): string;
    clone(): StreamedAssetParsingResult;
    constructor(streamedAsset: StreamedAsset | undefined, lastSpendWasClawback: boolean, lastPaymentAmountIfClawback: bigint);
    streamedAsset: StreamedAsset | undefined;
    lastSpendWasClawback: boolean;
    lastPaymentAmountIfClawback: bigint;
}
export class Cat {
    free(): void;
    __getClassname(): string;
    clone(): Cat;
    constructor(coin: Coin, lineageProof: LineageProof | undefined, info: CatInfo);
    coin: Coin;
    lineageProof: LineageProof | undefined;
    info: CatInfo;
    childLineageProof(): LineageProof;
    child(p2PuzzleHash: Uint8Array, amount: bigint): Cat;
    unrevocableChild(p2PuzzleHash: Uint8Array, amount: bigint): Cat;
}
export class CatInfo {
    free(): void;
    __getClassname(): string;
    clone(): CatInfo;
    constructor(assetId: Uint8Array, hiddenPuzzleHash: Uint8Array | undefined, p2PuzzleHash: Uint8Array);
    assetId: Uint8Array;
    hiddenPuzzleHash: Uint8Array | undefined;
    p2PuzzleHash: Uint8Array;
    innerPuzzleHash(): Uint8Array;
    puzzleHash(): Uint8Array;
}
export class CatSpend {
    free(): void;
    __getClassname(): string;
    clone(): CatSpend;
    cat: Cat;
    spend: Spend;
    hidden: boolean;
    constructor(cat: Cat, spend: Spend);
    static revoke(cat: Cat, spend: Spend): CatSpend;
}
export class ParsedCatInfo {
    free(): void;
    __getClassname(): string;
    clone(): ParsedCatInfo;
    constructor(info: CatInfo, p2Puzzle?: Puzzle | undefined);
    info: CatInfo;
    p2Puzzle: Puzzle | undefined;
}
export class ParsedCat {
    free(): void;
    __getClassname(): string;
    clone(): ParsedCat;
    constructor(cat: Cat, p2Puzzle: Puzzle, p2Solution: Program, revoked: boolean);
    cat: Cat;
    p2Puzzle: Puzzle;
    p2Solution: Program;
    revoked: boolean;
}
export class Nft {
    free(): void;
    __getClassname(): string;
    clone(): Nft;
    constructor(coin: Coin, proof: Proof, info: NftInfo);
    coin: Coin;
    proof: Proof;
    info: NftInfo;
    childProof(): Proof;
    child(p2PuzzleHash: Uint8Array, currentOwner: Uint8Array | undefined, metadata: Program): Nft;
    childWith(info: NftInfo): Nft;
}
export class NftInfo {
    free(): void;
    __getClassname(): string;
    clone(): NftInfo;
    constructor(launcherId: Uint8Array, metadata: Program, metadataUpdaterPuzzleHash: Uint8Array, currentOwner: Uint8Array | undefined, royaltyPuzzleHash: Uint8Array, royaltyBasisPoints: number, p2PuzzleHash: Uint8Array);
    launcherId: Uint8Array;
    metadata: Program;
    metadataUpdaterPuzzleHash: Uint8Array;
    currentOwner: Uint8Array | undefined;
    royaltyPuzzleHash: Uint8Array;
    royaltyBasisPoints: number;
    p2PuzzleHash: Uint8Array;
    innerPuzzleHash(): Uint8Array;
    puzzleHash(): Uint8Array;
}
export class ParsedNftInfo {
    free(): void;
    __getClassname(): string;
    clone(): ParsedNftInfo;
    constructor(info: NftInfo, p2Puzzle: Puzzle);
    info: NftInfo;
    p2Puzzle: Puzzle;
}
export class ParsedNft {
    free(): void;
    __getClassname(): string;
    clone(): ParsedNft;
    constructor(nft: Nft, p2Puzzle: Puzzle, p2Solution: Program);
    nft: Nft;
    p2Puzzle: Puzzle;
    p2Solution: Program;
}
export class NftMetadata {
    free(): void;
    __getClassname(): string;
    clone(): NftMetadata;
    constructor(editionNumber: bigint, editionTotal: bigint, dataUris: string[], dataHash: Uint8Array | undefined, metadataUris: string[], metadataHash: Uint8Array | undefined, licenseUris: string[], licenseHash?: Uint8Array | undefined);
    editionNumber: bigint;
    editionTotal: bigint;
    dataUris: string[];
    dataHash: Uint8Array | undefined;
    metadataUris: string[];
    metadataHash: Uint8Array | undefined;
    licenseUris: string[];
    licenseHash: Uint8Array | undefined;
}
export class HandleNftMetadata {
    free(): void;
    __getClassname(): string;
    clone(): HandleNftMetadata;
    constructor(displayName: string | undefined, imageUris: string[], imageHash: Uint8Array | undefined, metadataUris: string[], metadataHash: Uint8Array | undefined, licenseUris: string[], licenseHash?: Uint8Array | undefined);
    displayName: string | undefined;
    imageUris: string[];
    imageHash: Uint8Array | undefined;
    metadataUris: string[];
    metadataHash: Uint8Array | undefined;
    licenseUris: string[];
    licenseHash: Uint8Array | undefined;
}
export class MetadataUpdate {
    free(): void;
    __getClassname(): string;
    clone(): MetadataUpdate;
    constructor(kind: UriKind, uri: string);
    kind: UriKind;
    uri: string;
}
export enum UriKind {
    Data = 0,
    Metadata = 1,
    License = 2,
}
export class NftMint {
    free(): void;
    __getClassname(): string;
    clone(): NftMint;
    constructor(metadata: Program, metadataUpdaterPuzzleHash: Uint8Array, p2PuzzleHash: Uint8Array, royaltyPuzzleHash: Uint8Array, royaltyBasisPoints: number, transferCondition?: TransferNft | undefined);
    metadata: Program;
    metadataUpdaterPuzzleHash: Uint8Array;
    p2PuzzleHash: Uint8Array;
    royaltyPuzzleHash: Uint8Array;
    royaltyBasisPoints: number;
    transferCondition: TransferNft | undefined;
}
export class MintedNfts {
    free(): void;
    __getClassname(): string;
    clone(): MintedNfts;
    constructor(nfts: Nft[], parentConditions: Program[]);
    nfts: Nft[];
    parentConditions: Program[];
}
export class Did {
    free(): void;
    __getClassname(): string;
    clone(): Did;
    constructor(coin: Coin, proof: Proof, info: DidInfo);
    coin: Coin;
    proof: Proof;
    info: DidInfo;
    childProof(): Proof;
    child(p2PuzzleHash: Uint8Array, metadata: Program): Did;
    childWith(info: DidInfo): Did;
}
export class DidInfo {
    free(): void;
    __getClassname(): string;
    clone(): DidInfo;
    constructor(launcherId: Uint8Array, recoveryListHash: Uint8Array | undefined, numVerificationsRequired: bigint, metadata: Program, p2PuzzleHash: Uint8Array);
    launcherId: Uint8Array;
    recoveryListHash: Uint8Array | undefined;
    numVerificationsRequired: bigint;
    metadata: Program;
    p2PuzzleHash: Uint8Array;
    innerPuzzleHash(): Uint8Array;
    puzzleHash(): Uint8Array;
}
export class ParsedDidInfo {
    free(): void;
    __getClassname(): string;
    clone(): ParsedDidInfo;
    constructor(info: DidInfo, p2Puzzle: Puzzle);
    info: DidInfo;
    p2Puzzle: Puzzle;
}
export class ParsedDid {
    free(): void;
    __getClassname(): string;
    clone(): ParsedDid;
    constructor(did: Did, p2Spend?: ParsedDidSpend | undefined);
    did: Did;
    p2Spend: ParsedDidSpend | undefined;
}
export class ParsedDidSpend {
    free(): void;
    __getClassname(): string;
    clone(): ParsedDidSpend;
    constructor(puzzle: Puzzle, solution: Program);
    puzzle: Puzzle;
    solution: Program;
}
export class CreatedDid {
    free(): void;
    __getClassname(): string;
    clone(): CreatedDid;
    constructor(did: Did, parentConditions: Program[]);
    did: Did;
    parentConditions: Program[];
}
export class OptionContract {
    free(): void;
    __getClassname(): string;
    clone(): OptionContract;
    constructor(coin: Coin, proof: Proof, info: OptionInfo);
    coin: Coin;
    proof: Proof;
    info: OptionInfo;
}
export class OptionInfo {
    free(): void;
    __getClassname(): string;
    clone(): OptionInfo;
    constructor(launcherId: Uint8Array, underlyingCoinId: Uint8Array, underlyingDelegatedPuzzleHash: Uint8Array, p2PuzzleHash: Uint8Array);
    launcherId: Uint8Array;
    underlyingCoinId: Uint8Array;
    underlyingDelegatedPuzzleHash: Uint8Array;
    p2PuzzleHash: Uint8Array;
    innerPuzzleHash(): Uint8Array;
    puzzleHash(): Uint8Array;
}
export class ParsedOptionInfo {
    free(): void;
    __getClassname(): string;
    clone(): ParsedOptionInfo;
    constructor(info: OptionInfo, p2Puzzle: Puzzle);
    info: OptionInfo;
    p2Puzzle: Puzzle;
}
export class ParsedOption {
    free(): void;
    __getClassname(): string;
    clone(): ParsedOption;
    constructor(option: OptionContract, p2Puzzle: Puzzle, p2Solution: Program);
    option: OptionContract;
    p2Puzzle: Puzzle;
    p2Solution: Program;
}
export class OptionUnderlying {
    free(): void;
    __getClassname(): string;
    clone(): OptionUnderlying;
    constructor(launcherId: Uint8Array, creatorPuzzleHash: Uint8Array, seconds: bigint, amount: bigint, strikeType: OptionType);
    launcherId: Uint8Array;
    creatorPuzzleHash: Uint8Array;
    seconds: bigint;
    amount: bigint;
    strikeType: OptionType;
    exerciseSpend(clvm: Clvm, singletonInnerPuzzleHash: Uint8Array, singletonAmount: bigint): Spend;
    clawbackSpend(spend: Spend): Spend;
    puzzleHash(): Uint8Array;
    delegatedPuzzleHash(): Uint8Array;
}
export class OptionMetadata {
    free(): void;
    __getClassname(): string;
    clone(): OptionMetadata;
    constructor(expirationSeconds: bigint, strikeType: OptionType);
    expirationSeconds: bigint;
    strikeType: OptionType;
}
export class OptionType {
    free(): void;
    __getClassname(): string;
    clone(): OptionType;
    static xch(amount: bigint): OptionType;
    static cat(assetId: Uint8Array, amount: bigint): OptionType;
    static revocableCat(assetId: Uint8Array, hiddenPuzzleHash: Uint8Array, amount: bigint): OptionType;
    static nft(launcherId: Uint8Array, settlementPuzzleHash: Uint8Array, amount: bigint): OptionType;
    toXch(): OptionTypeXch | undefined;
    toCat(): OptionTypeCat | undefined;
    toRevocableCat(): OptionTypeRevocableCat | undefined;
    toNft(): OptionTypeNft | undefined;
}
export class OptionTypeXch {
    free(): void;
    __getClassname(): string;
    clone(): OptionTypeXch;
    amount: bigint;
}
export class OptionTypeCat {
    free(): void;
    __getClassname(): string;
    clone(): OptionTypeCat;
    assetId: Uint8Array;
    amount: bigint;
}
export class OptionTypeRevocableCat {
    free(): void;
    __getClassname(): string;
    clone(): OptionTypeRevocableCat;
    assetId: Uint8Array;
    hiddenPuzzleHash: Uint8Array;
    amount: bigint;
}
export class OptionTypeNft {
    free(): void;
    __getClassname(): string;
    clone(): OptionTypeNft;
    launcherId: Uint8Array;
    settlementPuzzleHash: Uint8Array;
    amount: bigint;
}
export class StreamingPuzzleInfo {
    free(): void;
    __getClassname(): string;
    clone(): StreamingPuzzleInfo;
    constructor(recipient: Uint8Array, clawbackPh: Uint8Array | undefined, endTime: bigint, lastPaymentTime: bigint);
    recipient: Uint8Array;
    clawbackPh: Uint8Array | undefined;
    endTime: bigint;
    lastPaymentTime: bigint;
    amountToBePaid(myCoinAmount: bigint, paymentTime: bigint): bigint;
    static getHint(recipient: Uint8Array): Uint8Array;
    getLaunchHints(): Uint8Array[];
    innerPuzzleHash(): Uint8Array;
    static fromMemos(memos: Uint8Array[]): StreamingPuzzleInfo | undefined;
}
export class StreamedAsset {
    free(): void;
    __getClassname(): string;
    clone(): StreamedAsset;
    constructor(coin: Coin, assetId: Uint8Array | undefined, proof: LineageProof | undefined, info: StreamingPuzzleInfo);
    coin: Coin;
    assetId: Uint8Array | undefined;
    proof: LineageProof | undefined;
    info: StreamingPuzzleInfo;
    static xch(coin: Coin, info: StreamingPuzzleInfo): StreamedAsset;
    static cat(coin: Coin, assetId: Uint8Array, proof: LineageProof, info: StreamingPuzzleInfo): StreamedAsset;
}
export class ClawbackV2 {
    free(): void;
    __getClassname(): string;
    clone(): ClawbackV2;
    constructor(senderPuzzleHash: Uint8Array, receiverPuzzleHash: Uint8Array, seconds: bigint, amount: bigint, hinted: boolean);
    senderPuzzleHash: Uint8Array;
    receiverPuzzleHash: Uint8Array;
    seconds: bigint;
    amount: bigint;
    hinted: boolean;
    static fromMemo(memo: Program, receiverPuzzleHash: Uint8Array, amount: bigint, hinted: boolean, expectedPuzzleHash: Uint8Array): ClawbackV2 | undefined;
    senderSpend(spend: Spend): Spend;
    receiverSpend(spend: Spend): Spend;
    pushThroughSpend(clvm: Clvm): Spend;
    puzzleHash(): Uint8Array;
    memo(clvm: Clvm): Program;
}
export class Clawback {
    free(): void;
    __getClassname(): string;
    clone(): Clawback;
    constructor(timelock: bigint, senderPuzzleHash: Uint8Array, receiverPuzzleHash: Uint8Array);
    timelock: bigint;
    senderPuzzleHash: Uint8Array;
    receiverPuzzleHash: Uint8Array;
    senderSpend(spend: Spend): Spend;
    receiverSpend(spend: Spend): Spend;
    puzzleHash(): Uint8Array;
    getRemarkCondition(clvm: Clvm): Remark;
}
export class MedievalVaultHint {
    free(): void;
    __getClassname(): string;
    clone(): MedievalVaultHint;
    constructor(myLauncherId: Uint8Array, m: usize, publicKeyList: PublicKey[]);
    myLauncherId: Uint8Array;
    m: usize;
    publicKeyList: PublicKey[];
}
export class MedievalVaultInfo {
    free(): void;
    __getClassname(): string;
    clone(): MedievalVaultInfo;
    constructor(launcherId: Uint8Array, m: usize, publicKeyList: PublicKey[]);
    launcherId: Uint8Array;
    m: usize;
    publicKeyList: PublicKey[];
    innerPuzzleHash(): Uint8Array;
    puzzleHash(): Uint8Array;
    static fromHint(hint: MedievalVaultHint): MedievalVaultInfo;
    toHint(): MedievalVaultHint;
}
export class MedievalVault {
    free(): void;
    __getClassname(): string;
    clone(): MedievalVault;
    constructor(coin: Coin, proof: Proof, info: MedievalVaultInfo);
    coin: Coin;
    proof: Proof;
    info: MedievalVaultInfo;
    child(newM: usize, newPublicKeyList: PublicKey[]): MedievalVault;
}
export class Bulletin {
    free(): void;
    __getClassname(): string;
    clone(): Bulletin;
    constructor(coin: Coin, hiddenPuzzleHash: Uint8Array, messages: BulletinMessage[]);
    coin: Coin;
    hiddenPuzzleHash: Uint8Array;
    messages: BulletinMessage[];
    conditions(clvm: Clvm): Program[];
    spend(spend: Spend): void;
}
export class BulletinMessage {
    free(): void;
    __getClassname(): string;
    clone(): BulletinMessage;
    constructor(topic: string, content: string);
    topic: string;
    content: string;
}
export class CreatedBulletin {
    free(): void;
    __getClassname(): string;
    clone(): CreatedBulletin;
    constructor(bulletin: Bulletin, parentConditions: Program[]);
    bulletin: Bulletin;
    parentConditions: Program[];
}
export class ParsedBulletin {
    free(): void;
    __getClassname(): string;
    clone(): ParsedBulletin;
    constructor(bulletin: Bulletin, p2Puzzle: Puzzle, p2Solution: Program);
    bulletin: Bulletin;
    p2Puzzle: Puzzle;
    p2Solution: Program;
}
export class P2ParentCoin {
    free(): void;
    __getClassname(): string;
    clone(): P2ParentCoin;
    constructor(coin: Coin, assetId: Uint8Array | undefined, proof: LineageProof);
    coin: Coin;
    assetId: Uint8Array | undefined;
    proof: LineageProof;
    static innerPuzzleHash(assetId?: Uint8Array | undefined): Uint8Array;
    static puzzleHash(assetId?: Uint8Array | undefined): Uint8Array;
    spend(delegatedSpend: Spend): void;
}
export class P2ParentCoinChildParseResult {
    free(): void;
    __getClassname(): string;
    clone(): P2ParentCoinChildParseResult;
    constructor(p2ParentCoin: P2ParentCoin, memos: Uint8Array[]);
    p2ParentCoin: P2ParentCoin;
    memos: Uint8Array[];
}
export class P2NextRewardDistributorEpochCoinInfo {
    free(): void;
    __getClassname(): string;
    clone(): P2NextRewardDistributorEpochCoinInfo;
    clawbackInnerPuzzleHash: Uint8Array;
    rewardAssetId: Uint8Array;
    rewardDistributorLauncherId: Uint8Array;
    rewardDistributorFirstEpochStart: bigint;
    rewardDistributorEpochSeconds: bigint;
    constructor(clawbackInnerPuzzleHash: Uint8Array, rewardAssetId: Uint8Array, rewardDistributorLauncherId: Uint8Array, rewardDistributorFirstEpochStart: bigint, rewardDistributorEpochSeconds: bigint);
    static fromConstants(constants: RewardDistributorConstants, rewardDistributorFirstEpochStart: bigint, clawbackInnerPuzzleHash: Uint8Array): P2NextRewardDistributorEpochCoinInfo;
    clawbackPuzzleHash(coinId: Uint8Array): Uint8Array;
    innerPuzzleHash(): Uint8Array;
    puzzleHash(): Uint8Array;
}
export class CuratedDatastoreFields {
    free(): void;
    __getClassname(): string;
    clone(): CuratedDatastoreFields;
    constructor(rootHash: Uint8Array, metadataRestHash: Uint8Array | undefined, metadataUpdaterHashHash: Uint8Array, innerPuzzleHash: Uint8Array);
    rootHash: Uint8Array;
    metadataRestHash: Uint8Array | undefined;
    metadataUpdaterHashHash: Uint8Array;
    innerPuzzleHash: Uint8Array;
}
export class DatastoreMetadata {
    free(): void;
    __getClassname(): string;
    clone(): DatastoreMetadata;
    constructor(rootHash: Uint8Array, label?: string | undefined, description?: string | undefined, bytes?: bigint | undefined, sizeProof?: string | undefined);
    rootHash: Uint8Array;
    label: string | undefined;
    description: string | undefined;
    bytes: bigint | undefined;
    sizeProof: string | undefined;
}
export class DelegatedPuzzleOracle {
    free(): void;
    __getClassname(): string;
    clone(): DelegatedPuzzleOracle;
    constructor(oraclePuzzleHash: Uint8Array, oracleFee: bigint);
    oraclePuzzleHash: Uint8Array;
    oracleFee: bigint;
}
export class DelegatedPuzzle {
    free(): void;
    __getClassname(): string;
    clone(): DelegatedPuzzle;
    static oracle(oraclePuzzleHash: Uint8Array, oracleFee: bigint): DelegatedPuzzle;
    static admin(puzzleHash: Uint8Array): DelegatedPuzzle;
    static writer(innerPuzzleHash: Uint8Array): DelegatedPuzzle;
    static adminFromKey(syntheticKey: PublicKey): DelegatedPuzzle;
    static writerFromKey(syntheticKey: PublicKey): DelegatedPuzzle;
    toAdmin(): Uint8Array | undefined;
    toWriter(): Uint8Array | undefined;
    toOracle(): DelegatedPuzzleOracle | undefined;
}
export class MintedDatastore {
    free(): void;
    __getClassname(): string;
    clone(): MintedDatastore;
    constructor(datastore: Datastore, parentConditions: Program[]);
    datastore: Datastore;
    parentConditions: Program[];
}
export class Datastore {
    free(): void;
    __getClassname(): string;
    clone(): Datastore;
    coin(): Coin;
    proof(): Proof;
    launcherId(): Uint8Array;
    ownerPuzzleHash(): Uint8Array;
    metadata(): DatastoreMetadata;
    rootHash(): Uint8Array;
    label(): string | undefined;
    description(): string | undefined;
    bytes(): bigint | undefined;
    sizeProof(): string | undefined;
    delegatedPuzzles(): DelegatedPuzzle[];
    curatedFields(): CuratedDatastoreFields;
    ownerCreateCoinCondition(newOwnerPuzzleHash: Uint8Array, newDelegatedPuzzles: DelegatedPuzzle[], hintDelegatedPuzzles: boolean): Program;
    newMetadataCondition(newMetadata: DatastoreMetadata): Program;
    spend(innerSpend: Spend): Datastore;
    spendOracle(): void;
    updateMetadataAsOwner(ownerSyntheticKey: PublicKey, newMetadata: DatastoreMetadata): Datastore;
    updateOwnership(newOwnerPuzzleHash: Uint8Array, newDelegatedPuzzles: DelegatedPuzzle[], ownerSyntheticKey?: PublicKey | undefined, adminSyntheticKey?: PublicKey | undefined): Datastore;
}
export class RewardDistributorType {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorType;
    static managed(managerSingletonLauncherId: Uint8Array): RewardDistributorType;
    static nftCollection(collectionDidLauncherId: Uint8Array): RewardDistributorType;
    static curatedNft(storeLauncherId: Uint8Array, refreshable: boolean): RewardDistributorType;
    static cat(assetId: Uint8Array, hiddenPuzzleHash?: Uint8Array | undefined): RewardDistributorType;
}
export class RewardDistributorConstants {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorConstants;
    launcherId: Uint8Array;
    feePayoutPuzzleHash: Uint8Array;
    epochSeconds: bigint;
    precision: bigint;
    maxSecondsOffset: bigint;
    payoutThreshold: bigint;
    requirePayoutApproval: boolean;
    feeBps: bigint;
    withdrawalShareBps: bigint;
    reserveAssetId: Uint8Array;
    reserveInnerPuzzleHash: Uint8Array;
    reserveFullPuzzleHash: Uint8Array;
    static withoutLauncherId(rewardDistributorType: RewardDistributorType, feePayoutPuzzleHash: Uint8Array, epochSeconds: bigint, precision: bigint, maxSecondsOffset: bigint, payoutThreshold: bigint, requirePayoutApproval: boolean, feeBps: bigint, withdrawalShareBps: bigint, reserveAssetId: Uint8Array): RewardDistributorConstants;
    withLauncherId(launcherId: Uint8Array): RewardDistributorConstants;
    rewardDistributorType(): RewardDistributorType;
}
export class RoundRewardInfo {
    free(): void;
    __getClassname(): string;
    clone(): RoundRewardInfo;
    constructor(cumulativePayout: bigint, remainingRewards: bigint);
    cumulativePayout: bigint;
    remainingRewards: bigint;
}
export class RoundTimeInfo {
    free(): void;
    __getClassname(): string;
    clone(): RoundTimeInfo;
    constructor(lastUpdate: bigint, epochEnd: bigint);
    lastUpdate: bigint;
    epochEnd: bigint;
}
export class RewardDistributorState {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorState;
    constructor(totalReserves: bigint, activeShares: bigint, roundRewardInfo: RoundRewardInfo, roundTimeInfo: RoundTimeInfo);
    totalReserves: bigint;
    activeShares: bigint;
    roundRewardInfo: RoundRewardInfo;
    roundTimeInfo: RoundTimeInfo;
    static initial(firstEpochStart: bigint): RewardDistributorState;
}
export class RewardDistributorStateTransition {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorStateTransition;
    oldState: RewardDistributorState;
    newState: RewardDistributorState;
}
export class RewardDistributorNftStakeEntry {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorNftStakeEntry;
    launcherId: Uint8Array;
    shares: bigint;
}
export class RewardDistributorAddEntryActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorAddEntryActionLog;
    createdEntrySlot: RewardDistributorEntrySlotValue;
    managerSingletonInnerPuzzleHash: Uint8Array;
    changes: RewardDistributorStateTransition;
}
export class RewardDistributorRemoveEntryActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorRemoveEntryActionLog;
    spentEntrySlot: RewardDistributorEntrySlotValue;
    managerSingletonInnerPuzzleHash: Uint8Array;
    changes: RewardDistributorStateTransition;
}
export class RewardDistributorAddIncentivesActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorAddIncentivesActionLog;
    amount: bigint;
    managerFee: bigint;
    changes: RewardDistributorStateTransition;
}
export class RewardDistributorCommitIncentivesActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorCommitIncentivesActionLog;
    spentRewardSlot: RewardDistributorRewardSlotValue;
    createdCommitmentSlot: RewardDistributorCommitmentSlotValue;
    createdRewardSlots: RewardDistributorRewardSlotValue[];
    changes: RewardDistributorStateTransition;
}
export class RewardDistributorInitiatePayoutActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorInitiatePayoutActionLog;
    spentEntrySlot: RewardDistributorEntrySlotValue;
    createdEntrySlot: RewardDistributorEntrySlotValue;
    entryPayoutAmount: bigint;
    payoutRoundingError: bigint;
    changes: RewardDistributorStateTransition;
}
export class RewardDistributorNewEpochActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorNewEpochActionLog;
    spentRewardSlot: RewardDistributorRewardSlotValue;
    createdRewardSlot: RewardDistributorRewardSlotValue;
    epochTotalRewards: bigint;
    changes: RewardDistributorStateTransition;
}
export class RewardDistributorSyncActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorSyncActionLog;
    updateTime: bigint;
    changes: RewardDistributorStateTransition;
}
export class RewardDistributorWithdrawIncentivesActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorWithdrawIncentivesActionLog;
    spentRewardSlot: RewardDistributorRewardSlotValue;
    spentCommitmentSlot: RewardDistributorCommitmentSlotValue;
    createdRewardSlot: RewardDistributorRewardSlotValue;
    changes: RewardDistributorStateTransition;
}
export class RewardDistributorRefreshNftsFromDlActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorRefreshNftsFromDlActionLog;
    spentEntrySlots: RewardDistributorEntrySlotValue[];
    createdEntrySlots: RewardDistributorEntrySlotValue[];
    nftEntries: RewardDistributorNftStakeEntry[];
    dlRootHash: Uint8Array;
    dlInnerPuzzleHash: Uint8Array;
    dlFullPuzzleHash: Uint8Array;
    changes: RewardDistributorStateTransition;
}
export class RewardDistributorStakeActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorStakeActionLog;
    spentEntrySlot: RewardDistributorEntrySlotValue | undefined;
    createdEntrySlot: RewardDistributorEntrySlotValue;
    catAmount: bigint | undefined;
    nftEntries: RewardDistributorNftStakeEntry[] | undefined;
    changes: RewardDistributorStateTransition;
}
export class RewardDistributorUnstakeActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorUnstakeActionLog;
    spentEntrySlot: RewardDistributorEntrySlotValue;
    createdEntrySlot: RewardDistributorEntrySlotValue;
    catAmount: bigint | undefined;
    nftEntries: RewardDistributorNftStakeEntry[] | undefined;
    changes: RewardDistributorStateTransition;
}
export class RewardDistributorActionLog {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorActionLog;
    kind: string;
    addEntry: RewardDistributorAddEntryActionLog | undefined;
    removeEntry: RewardDistributorRemoveEntryActionLog | undefined;
    addIncentives: RewardDistributorAddIncentivesActionLog | undefined;
    commitIncentives: RewardDistributorCommitIncentivesActionLog | undefined;
    initiatePayout: RewardDistributorInitiatePayoutActionLog | undefined;
    newEpoch: RewardDistributorNewEpochActionLog | undefined;
    sync: RewardDistributorSyncActionLog | undefined;
    withdrawIncentives: RewardDistributorWithdrawIncentivesActionLog | undefined;
    refreshNftsFromDl: RewardDistributorRefreshNftsFromDlActionLog | undefined;
    stake: RewardDistributorStakeActionLog | undefined;
    unstake: RewardDistributorUnstakeActionLog | undefined;
}
export class RewardDistributorLauncherSolutionInfo {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorLauncherSolutionInfo;
    constructor(constants: RewardDistributorConstants, initialState: RewardDistributorState, coin: Coin);
    constants: RewardDistributorConstants;
    initialState: RewardDistributorState;
    coin: Coin;
}
export class RewardDistributorFinishedSpendResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorFinishedSpendResult;
    constructor(newDistributor: RewardDistributor, signature: Signature);
    newDistributor: RewardDistributor;
    signature: Signature;
}
export class RewardDistributorRewardSlotValue {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorRewardSlotValue;
    constructor(counter: bigint, epochStart: bigint, nextEpochInitialized: boolean, rewards: bigint);
    counter: bigint;
    epochStart: bigint;
    nextEpochInitialized: boolean;
    rewards: bigint;
}
export class RewardSlot {
    free(): void;
    __getClassname(): string;
    clone(): RewardSlot;
    coin: Coin;
    proof: LineageProof;
    nonce: bigint;
    launcherId: Uint8Array;
    value: RewardDistributorRewardSlotValue;
    static new(proof: LineageProof, launcherId: Uint8Array, value: RewardDistributorRewardSlotValue): RewardSlot;
    valueHash(): Uint8Array;
}
export class RewardDistributorCommitmentSlotValue {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorCommitmentSlotValue;
    constructor(epochStart: bigint, clawbackPh: Uint8Array, rewards: bigint);
    epochStart: bigint;
    clawbackPh: Uint8Array;
    rewards: bigint;
}
export class CommitmentSlot {
    free(): void;
    __getClassname(): string;
    clone(): CommitmentSlot;
    coin: Coin;
    proof: LineageProof;
    nonce: bigint;
    launcherId: Uint8Array;
    value: RewardDistributorCommitmentSlotValue;
    static new(proof: LineageProof, launcherId: Uint8Array, value: RewardDistributorCommitmentSlotValue): CommitmentSlot;
    valueHash(): Uint8Array;
}
export class RewardDistributorEntrySlotValue {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorEntrySlotValue;
    constructor(counter: bigint, payoutPuzzleHash: Uint8Array, initialCumulativePayout: bigint, shares: bigint);
    counter: bigint;
    payoutPuzzleHash: Uint8Array;
    initialCumulativePayout: bigint;
    shares: bigint;
}
export class EntrySlot {
    free(): void;
    __getClassname(): string;
    clone(): EntrySlot;
    coin: Coin;
    proof: LineageProof;
    nonce: bigint;
    launcherId: Uint8Array;
    value: RewardDistributorEntrySlotValue;
    static new(proof: LineageProof, launcherId: Uint8Array, value: RewardDistributorEntrySlotValue): EntrySlot;
    valueHash(): Uint8Array;
}
export class RewardDistributorInitiatePayoutResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorInitiatePayoutResult;
    conditions: Program[];
    payoutAmount: bigint;
}
export class RewardDistributorNewEpochResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorNewEpochResult;
    conditions: Program[];
    epochFee: bigint;
}
export class RewardDistributorWithdrawIncentivesResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorWithdrawIncentivesResult;
    conditions: Program[];
    withdrawnAmount: bigint;
}
export class RewardDistributorRemoveEntryResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorRemoveEntryResult;
    conditions: Program[];
    lastPaymentAmount: bigint;
}
export class IntermediaryCoinProof {
    free(): void;
    __getClassname(): string;
    clone(): IntermediaryCoinProof;
    constructor(fullPuzzleHash: Uint8Array, amount: bigint);
    fullPuzzleHash: Uint8Array;
    amount: bigint;
}
export class CompactLineageProof {
    free(): void;
    __getClassname(): string;
    clone(): CompactLineageProof;
    constructor(parentParentCoinInfo: Uint8Array, parentInnerPuzzleHash: Uint8Array, parentAmount: bigint);
    parentParentCoinInfo: Uint8Array;
    parentInnerPuzzleHash: Uint8Array;
    parentAmount: bigint;
    static fromLineageProof(proof: LineageProof): CompactLineageProof;
}
export class NftLauncherProof {
    free(): void;
    __getClassname(): string;
    clone(): NftLauncherProof;
    constructor(didProof: CompactLineageProof, intermediaryCoinProofs: IntermediaryCoinProof[]);
    didProof: CompactLineageProof;
    intermediaryCoinProofs: IntermediaryCoinProof[];
}
export class RewardDistributorStakeCollectionNftsResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorStakeCollectionNftsResult;
    conditions: Program[];
    notarizedPayments: NotarizedPayment[];
    newNfts: Nft[];
}
export class RewardDistributorStakeCuratedNftsResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorStakeCuratedNftsResult;
    conditions: Program[];
    notarizedPayments: NotarizedPayment[];
    newNfts: Nft[];
}
export class RewardDistributorStakeCatResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorStakeCatResult;
    conditions: Program[];
    notarizedPayment: NotarizedPayment;
    newCat: Cat;
}
export class RewardDistributorUnstakeLockedNftsResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorUnstakeLockedNftsResult;
    conditions: Program[];
    paymentAmount: bigint;
}
export class RewardDistributorUnstakeLockedCatResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorUnstakeLockedCatResult;
    conditions: Program[];
    paymentAmount: bigint;
}
export class RewardDistributorRefreshNftsResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorRefreshNftsResult;
    conditions: Program[];
    newNfts: Nft[];
}
export class RefreshNftsInfo {
    free(): void;
    __getClassname(): string;
    clone(): RefreshNftsInfo;
    constructor(slot: EntrySlot, nfts: Nft[], nftSharesDelta: bigint[], newShares: bigint[], nftInclusionProofs: MerkleProof[]);
    slot: EntrySlot;
    nfts: Nft[];
    nftSharesDelta: bigint[];
    newShares: bigint[];
    nftInclusionProofs: MerkleProof[];
}
export class RewardDistributorLaunchResult {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorLaunchResult;
    constructor(securitySignature: Signature, securitySecretKey: SecretKey, rewardDistributor: RewardDistributor, firstEpochSlot: RewardSlot, refundedCat: Cat);
    securitySignature: Signature;
    securitySecretKey: SecretKey;
    rewardDistributor: RewardDistributor;
    firstEpochSlot: RewardSlot;
    refundedCat: Cat;
}
export class RewardDistributorInfoFromLauncher {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorInfoFromLauncher;
    constructor(constants: RewardDistributorConstants, initialState: RewardDistributorState, eveSingleton: Coin);
    constants: RewardDistributorConstants;
    initialState: RewardDistributorState;
    eveSingleton: Coin;
}
export class RewardDistributorInfoFromEveCoin {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributorInfoFromEveCoin;
    constructor(distributor: RewardDistributor, firstRewardSlot: RewardSlot);
    distributor: RewardDistributor;
    firstRewardSlot: RewardSlot;
}
export class RewardDistributor {
    free(): void;
    __getClassname(): string;
    clone(): RewardDistributor;
    coin(): Coin;
    proof(): Proof;
    state(): RewardDistributorState;
    constants(): RewardDistributorConstants;
    innerPuzzleHash(): Uint8Array;
    puzzleHash(): Uint8Array;
    reserveCoin(): Coin;
    reserveAssetId(): Uint8Array;
    reserveProof(): LineageProof;
    pendingCreatedRewardSlots(): RewardSlot[];
    pendingCreatedCommitmentSlots(): CommitmentSlot[];
    pendingCreatedEntrySlots(): EntrySlot[];
    pendingLogs(): RewardDistributorActionLogValue[];
    pendingSignature(): Signature;
    static reserveFullPuzzleHash(assetId: Uint8Array, distributorLauncherId: Uint8Array, nonce: bigint): Uint8Array;
    static parseLauncherSolution(launcherCoin: Coin, launcherSolution: Program): RewardDistributorInfoFromLauncher | undefined;
    finishSpend(otherCatSpends: CatSpend[]): RewardDistributorFinishedSpendResult;
    addIncentives(amount: bigint): Program[];
    commitIncentives(rewardSlot: RewardSlot, epochStart: bigint, clawbackPh: Uint8Array, rewardsToAdd: bigint): Program[];
    initiatePayout(entrySlot: EntrySlot): RewardDistributorInitiatePayoutResult;
    newEpoch(rewardSlot: RewardSlot): RewardDistributorNewEpochResult;
    sync(updateTime: bigint): Program[];
    withdrawIncentives(commitmentSlot: CommitmentSlot, rewardSlot: RewardSlot): RewardDistributorWithdrawIncentivesResult;
    addEntry(payoutPuzzleHash: Uint8Array, shares: bigint, managerSingletonInnerPuzzleHash: Uint8Array): Program[];
    removeEntry(entrySlot: EntrySlot, managerSingletonInnerPuzzleHash: Uint8Array): RewardDistributorRemoveEntryResult;
    stakeCollectionNfts(offeredNfts: Nft[], nftLauncherProofs: NftLauncherProof[], entryCustodyPuzzleHash: Uint8Array, existingSlot?: EntrySlot | undefined): RewardDistributorStakeCollectionNftsResult;
    stakeCuratedNfts(offeredNfts: Nft[], nftShares: bigint[], inclusionProofs: MerkleProof[], entryCustodyPuzzleHash: Uint8Array, existingSlot: EntrySlot | undefined, dlRootHash: Uint8Array, dlMetadataRestHash: Uint8Array | undefined, dlMetadataUpdaterHashHash: Uint8Array, dlInnerPuzzleHash: Uint8Array): RewardDistributorStakeCuratedNftsResult;
    stakeCat(offeredCat: Cat, entryCustodyPuzzleHash: Uint8Array, existingSlot?: EntrySlot | undefined): RewardDistributorStakeCatResult;
    unstakeLockedNfts(entrySlot: EntrySlot, lockedNfts: Nft[], lockedNftShares: bigint[]): RewardDistributorUnstakeLockedNftsResult;
    unstakeLockedCat(entrySlot: EntrySlot, lockedCat: Cat): RewardDistributorUnstakeLockedCatResult;
    refreshNfts(refreshNftsInfos: RefreshNftsInfo[], dlRootHash: Uint8Array, dlMetadataRestHash: Uint8Array | undefined, dlMetadataUpdaterHashHash: Uint8Array, dlInnerPuzzleHash: Uint8Array): RewardDistributorRefreshNftsResult;
    static lockedNftHint(distributorLauncherId: Uint8Array, custodyPuzzleHash: Uint8Array): Uint8Array;
}
export class RpcClient {
    free(): void;
    __getClassname(): string;
    clone(): RpcClient;
    constructor(coinsetUrl: string);
    static testnet11(): RpcClient;
    static mainnet(): RpcClient;
    getBlockchainState(): Promise<BlockchainStateResponse>;
    getAdditionsAndRemovals(headerHash: Uint8Array): Promise<AdditionsAndRemovalsResponse>;
    getBlock(headerHash: Uint8Array): Promise<GetBlockResponse>;
    getBlockRecord(headerHash: Uint8Array): Promise<GetBlockRecordResponse>;
    getBlockRecordByHeight(height: number): Promise<GetBlockRecordResponse>;
    getBlockRecords(startHeight: number, endHeight: number): Promise<GetBlockRecordsResponse>;
    getBlocks(start: number, end: number, excludeHeaderHash: boolean, excludeReorged: boolean): Promise<GetBlocksResponse>;
    getBlockSpends(headerHash: Uint8Array): Promise<GetBlockSpendsResponse>;
    getCoinRecordByName(name: Uint8Array): Promise<GetCoinRecordResponse>;
    getCoinRecordsByHint(hint: Uint8Array, startHeight?: number | undefined, endHeight?: number | undefined, includeSpentCoins?: boolean | undefined, cursor?: string | undefined): Promise<GetCoinRecordsResponse>;
    getCoinRecordsByHints(hints: Uint8Array[], startHeight?: number | undefined, endHeight?: number | undefined, includeSpentCoins?: boolean | undefined, cursor?: string | undefined): Promise<GetCoinRecordsResponse>;
    getCoinRecordsByNames(names: Uint8Array[], startHeight?: number | undefined, endHeight?: number | undefined, includeSpentCoins?: boolean | undefined, cursor?: string | undefined): Promise<GetCoinRecordsResponse>;
    getCoinRecordsByParentIds(parentIds: Uint8Array[], startHeight?: number | undefined, endHeight?: number | undefined, includeSpentCoins?: boolean | undefined, cursor?: string | undefined): Promise<GetCoinRecordsResponse>;
    getCoinRecordsByPuzzleHash(puzzleHash: Uint8Array, startHeight?: number | undefined, endHeight?: number | undefined, includeSpentCoins?: boolean | undefined, cursor?: string | undefined): Promise<GetCoinRecordsResponse>;
    getCoinRecordsByPuzzleHashes(puzzleHashes: Uint8Array[], startHeight?: number | undefined, endHeight?: number | undefined, includeSpentCoins?: boolean | undefined, cursor?: string | undefined): Promise<GetCoinRecordsResponse>;
    getPuzzleAndSolution(coinId: Uint8Array, height?: number | undefined): Promise<GetPuzzleAndSolutionResponse>;
    pushTx(spendBundle: SpendBundle): Promise<PushTxResponse>;
    getNetworkInfo(): Promise<GetNetworkInfoResponse>;
    getMempoolItemByTxId(txId: Uint8Array): Promise<GetMempoolItemResponse>;
    getMempoolItemsByCoinName(coinName: Uint8Array): Promise<GetMempoolItemsResponse>;
}
export class BlockchainStateResponse {
    free(): void;
    __getClassname(): string;
    clone(): BlockchainStateResponse;
    constructor(blockchainState: BlockchainState | undefined, error: string | undefined, success: boolean);
    blockchainState: BlockchainState | undefined;
    error: string | undefined;
    success: boolean;
}
export class BlockchainState {
    free(): void;
    __getClassname(): string;
    clone(): BlockchainState;
    constructor(averageBlockTime: bigint, blockMaxCost: bigint, difficulty: bigint, genesisChallengeInitialized: boolean, mempoolCost: bigint, mempoolFees: bigint, mempoolMaxTotalCost: bigint, mempoolMinFees: MempoolMinFees, mempoolSize: number, nodeId: Uint8Array, peak: BlockRecord, space: bigint, subSlotIters: bigint, sync: SyncState);
    averageBlockTime: bigint;
    blockMaxCost: bigint;
    difficulty: bigint;
    genesisChallengeInitialized: boolean;
    mempoolCost: bigint;
    mempoolFees: bigint;
    mempoolMaxTotalCost: bigint;
    mempoolMinFees: MempoolMinFees;
    mempoolSize: number;
    nodeId: Uint8Array;
    peak: BlockRecord;
    space: bigint;
    subSlotIters: bigint;
    sync: SyncState;
}
export class MempoolMinFees {
    free(): void;
    __getClassname(): string;
    clone(): MempoolMinFees;
    constructor(cost5000000: bigint);
    cost5000000: bigint;
}
export class SyncState {
    free(): void;
    __getClassname(): string;
    clone(): SyncState;
    constructor(syncMode: boolean, syncProgressHeight: number, syncTipHeight: number, synced: boolean);
    syncMode: boolean;
    syncProgressHeight: number;
    syncTipHeight: number;
    synced: boolean;
}
export class AdditionsAndRemovalsResponse {
    free(): void;
    __getClassname(): string;
    clone(): AdditionsAndRemovalsResponse;
    constructor(additions: CoinRecord[] | undefined, removals: CoinRecord[] | undefined, error: string | undefined, success: boolean);
    additions: CoinRecord[] | undefined;
    removals: CoinRecord[] | undefined;
    error: string | undefined;
    success: boolean;
}
export class GetBlockResponse {
    free(): void;
    __getClassname(): string;
    clone(): GetBlockResponse;
    constructor(block: FullBlock | undefined, error: string | undefined, success: boolean);
    block: FullBlock | undefined;
    error: string | undefined;
    success: boolean;
}
export class GetBlockRecordResponse {
    free(): void;
    __getClassname(): string;
    clone(): GetBlockRecordResponse;
    constructor(blockRecord: BlockRecord | undefined, error: string | undefined, success: boolean);
    blockRecord: BlockRecord | undefined;
    error: string | undefined;
    success: boolean;
}
export class GetBlockRecordsResponse {
    free(): void;
    __getClassname(): string;
    clone(): GetBlockRecordsResponse;
    constructor(blockRecords: BlockRecord[] | undefined, error: string | undefined, success: boolean);
    blockRecords: BlockRecord[] | undefined;
    error: string | undefined;
    success: boolean;
}
export class GetBlocksResponse {
    free(): void;
    __getClassname(): string;
    clone(): GetBlocksResponse;
    constructor(blocks: FullBlock[] | undefined, error: string | undefined, success: boolean);
    blocks: FullBlock[] | undefined;
    error: string | undefined;
    success: boolean;
}
export class GetBlockSpendsResponse {
    free(): void;
    __getClassname(): string;
    clone(): GetBlockSpendsResponse;
    constructor(blockSpends: CoinSpend[] | undefined, error: string | undefined, success: boolean);
    blockSpends: CoinSpend[] | undefined;
    error: string | undefined;
    success: boolean;
}
export class GetCoinRecordResponse {
    free(): void;
    __getClassname(): string;
    clone(): GetCoinRecordResponse;
    constructor(coinRecord: CoinRecord | undefined, error: string | undefined, success: boolean);
    coinRecord: CoinRecord | undefined;
    error: string | undefined;
    success: boolean;
}
export class GetCoinRecordsResponse {
    free(): void;
    __getClassname(): string;
    clone(): GetCoinRecordsResponse;
    constructor(coinRecords: CoinRecord[] | undefined, error: string | undefined, success: boolean, truncated?: boolean | undefined, nextCursor?: string | undefined);
    coinRecords: CoinRecord[] | undefined;
    error: string | undefined;
    success: boolean;
    truncated: boolean | undefined;
    nextCursor: string | undefined;
}
export class GetPuzzleAndSolutionResponse {
    free(): void;
    __getClassname(): string;
    clone(): GetPuzzleAndSolutionResponse;
    constructor(coinSolution: CoinSpend | undefined, error: string | undefined, success: boolean);
    coinSolution: CoinSpend | undefined;
    error: string | undefined;
    success: boolean;
}
export class PushTxResponse {
    free(): void;
    __getClassname(): string;
    clone(): PushTxResponse;
    constructor(status: string | undefined, error: string | undefined, success: boolean);
    status: string | undefined;
    error: string | undefined;
    success: boolean;
}
export class GetNetworkInfoResponse {
    free(): void;
    __getClassname(): string;
    clone(): GetNetworkInfoResponse;
    constructor(networkName: string | undefined, networkPrefix: string | undefined, genesisChallenge: Uint8Array | undefined, error: string | undefined, success: boolean);
    networkName: string | undefined;
    networkPrefix: string | undefined;
    genesisChallenge: Uint8Array | undefined;
    error: string | undefined;
    success: boolean;
}
export class GetMempoolItemResponse {
    free(): void;
    __getClassname(): string;
    clone(): GetMempoolItemResponse;
    constructor(mempoolItem: MempoolItem | undefined, error: string | undefined, success: boolean);
    mempoolItem: MempoolItem | undefined;
    error: string | undefined;
    success: boolean;
}
export class GetMempoolItemsResponse {
    free(): void;
    __getClassname(): string;
    clone(): GetMempoolItemsResponse;
    constructor(mempoolItems: MempoolItem[] | undefined, error: string | undefined, success: boolean);
    mempoolItems: MempoolItem[] | undefined;
    error: string | undefined;
    success: boolean;
}
export class CoinRecord {
    free(): void;
    __getClassname(): string;
    clone(): CoinRecord;
    constructor(coin: Coin, coinbase: boolean, confirmedBlockIndex: number, spent: boolean, spentBlockIndex: number, timestamp: bigint);
    coin: Coin;
    coinbase: boolean;
    confirmedBlockIndex: number;
    spent: boolean;
    spentBlockIndex: number;
    timestamp: bigint;
}
export class MempoolItem {
    free(): void;
    __getClassname(): string;
    clone(): MempoolItem;
    constructor(spendBundle: SpendBundle, fee: bigint);
    spendBundle: SpendBundle;
    fee: bigint;
}
export class FullBlock {
    free(): void;
    __getClassname(): string;
    clone(): FullBlock;
    constructor(finishedSubSlots: EndOfSubSlotBundle[], rewardChainBlock: RewardChainBlock, challengeChainSpProof: VDFProof | undefined, challengeChainIpProof: VDFProof, rewardChainSpProof: VDFProof | undefined, rewardChainIpProof: VDFProof, infusedChallengeChainIpProof: VDFProof | undefined, foliage: Foliage, foliageTransactionBlock: FoliageTransactionBlock | undefined, transactionsInfo: TransactionsInfo | undefined, transactionsGenerator: Uint8Array | undefined, transactionsGeneratorRefList: number[]);
    finishedSubSlots: EndOfSubSlotBundle[];
    rewardChainBlock: RewardChainBlock;
    challengeChainSpProof: VDFProof | undefined;
    challengeChainIpProof: VDFProof;
    rewardChainSpProof: VDFProof | undefined;
    rewardChainIpProof: VDFProof;
    infusedChallengeChainIpProof: VDFProof | undefined;
    foliage: Foliage;
    foliageTransactionBlock: FoliageTransactionBlock | undefined;
    transactionsInfo: TransactionsInfo | undefined;
    transactionsGenerator: Uint8Array | undefined;
    transactionsGeneratorRefList: number[];
}
export class EndOfSubSlotBundle {
    free(): void;
    __getClassname(): string;
    clone(): EndOfSubSlotBundle;
    constructor(challengeChain: ChallengeChainSubSlot, infusedChallengeChain: InfusedChallengeChainSubSlot | undefined, rewardChain: RewardChainSubSlot, proofs: SubSlotProofs);
    challengeChain: ChallengeChainSubSlot;
    infusedChallengeChain: InfusedChallengeChainSubSlot | undefined;
    rewardChain: RewardChainSubSlot;
    proofs: SubSlotProofs;
}
export class ChallengeChainSubSlot {
    free(): void;
    __getClassname(): string;
    clone(): ChallengeChainSubSlot;
    constructor(challengeChainEndOfSlotVdf: VDFInfo, infusedChallengeChainSubSlotHash?: Uint8Array | undefined, subepochSummaryHash?: Uint8Array | undefined, newSubSlotIters?: bigint | undefined, newDifficulty?: bigint | undefined);
    challengeChainEndOfSlotVdf: VDFInfo;
    infusedChallengeChainSubSlotHash: Uint8Array | undefined;
    subepochSummaryHash: Uint8Array | undefined;
    newSubSlotIters: bigint | undefined;
    newDifficulty: bigint | undefined;
}
export class InfusedChallengeChainSubSlot {
    free(): void;
    __getClassname(): string;
    clone(): InfusedChallengeChainSubSlot;
    constructor(infusedChallengeChainEndOfSlotVdf: VDFInfo);
    infusedChallengeChainEndOfSlotVdf: VDFInfo;
}
export class RewardChainSubSlot {
    free(): void;
    __getClassname(): string;
    clone(): RewardChainSubSlot;
    constructor(endOfSlotVdf: VDFInfo, challengeChainSubSlotHash: Uint8Array, infusedChallengeChainSubSlotHash: Uint8Array | undefined, deficit: number);
    endOfSlotVdf: VDFInfo;
    challengeChainSubSlotHash: Uint8Array;
    infusedChallengeChainSubSlotHash: Uint8Array | undefined;
    deficit: number;
}
export class SubSlotProofs {
    free(): void;
    __getClassname(): string;
    clone(): SubSlotProofs;
    constructor(challengeChainSlotProof: VDFProof, infusedChallengeChainSlotProof: VDFProof | undefined, rewardChainSlotProof: VDFProof);
    challengeChainSlotProof: VDFProof;
    infusedChallengeChainSlotProof: VDFProof | undefined;
    rewardChainSlotProof: VDFProof;
}
export class VDFInfo {
    free(): void;
    __getClassname(): string;
    clone(): VDFInfo;
    constructor(challenge: Uint8Array, numberOfIterations: bigint, output: Uint8Array);
    challenge: Uint8Array;
    numberOfIterations: bigint;
    output: Uint8Array;
}
export class VDFProof {
    free(): void;
    __getClassname(): string;
    clone(): VDFProof;
    constructor(witnessType: number, witness: Uint8Array, normalizedToIdentity: boolean);
    witnessType: number;
    witness: Uint8Array;
    normalizedToIdentity: boolean;
}
export class TransactionsInfo {
    free(): void;
    __getClassname(): string;
    clone(): TransactionsInfo;
    constructor(generatorRoot: Uint8Array, generatorRefsRoot: Uint8Array, aggregatedSignature: Signature, fees: bigint, cost: bigint, rewardClaimsIncorporated: Coin[]);
    generatorRoot: Uint8Array;
    generatorRefsRoot: Uint8Array;
    aggregatedSignature: Signature;
    fees: bigint;
    cost: bigint;
    rewardClaimsIncorporated: Coin[];
}
export class RewardChainBlock {
    free(): void;
    __getClassname(): string;
    clone(): RewardChainBlock;
    constructor(weight: bigint, height: number, totalIters: bigint, signagePointIndex: number, posSsCcChallengeHash: Uint8Array, proofOfSpace: ProofOfSpace, challengeChainSpVdf: VDFInfo | undefined, challengeChainSpSignature: Signature, challengeChainIpVdf: VDFInfo, rewardChainSpVdf: VDFInfo | undefined, rewardChainSpSignature: Signature, rewardChainIpVdf: VDFInfo, infusedChallengeChainIpVdf: VDFInfo | undefined, headerMmrRoot: Uint8Array | undefined, isTransactionBlock: boolean);
    weight: bigint;
    height: number;
    totalIters: bigint;
    signagePointIndex: number;
    posSsCcChallengeHash: Uint8Array;
    proofOfSpace: ProofOfSpace;
    challengeChainSpVdf: VDFInfo | undefined;
    challengeChainSpSignature: Signature;
    challengeChainIpVdf: VDFInfo;
    rewardChainSpVdf: VDFInfo | undefined;
    rewardChainSpSignature: Signature;
    rewardChainIpVdf: VDFInfo;
    infusedChallengeChainIpVdf: VDFInfo | undefined;
    headerMmrRoot: Uint8Array | undefined;
    isTransactionBlock: boolean;
}
export class FoliageTransactionBlock {
    free(): void;
    __getClassname(): string;
    clone(): FoliageTransactionBlock;
    constructor(prevTransactionBlockHash: Uint8Array, timestamp: bigint, filterHash: Uint8Array, additionsRoot: Uint8Array, removalsRoot: Uint8Array, transactionsInfoHash: Uint8Array);
    prevTransactionBlockHash: Uint8Array;
    timestamp: bigint;
    filterHash: Uint8Array;
    additionsRoot: Uint8Array;
    removalsRoot: Uint8Array;
    transactionsInfoHash: Uint8Array;
}
export class FoliageBlockData {
    free(): void;
    __getClassname(): string;
    clone(): FoliageBlockData;
    constructor(unfinishedRewardBlockHash: Uint8Array, poolTarget: PoolTarget, poolSignature: Signature | undefined, farmerRewardPuzzleHash: Uint8Array, extensionData: Uint8Array);
    unfinishedRewardBlockHash: Uint8Array;
    poolTarget: PoolTarget;
    poolSignature: Signature | undefined;
    farmerRewardPuzzleHash: Uint8Array;
    extensionData: Uint8Array;
}
export class Foliage {
    free(): void;
    __getClassname(): string;
    clone(): Foliage;
    constructor(prevBlockHash: Uint8Array, rewardBlockHash: Uint8Array, foliageBlockData: FoliageBlockData, foliageBlockDataSignature: Signature, foliageTransactionBlockHash?: Uint8Array | undefined, foliageTransactionBlockSignature?: Signature | undefined);
    prevBlockHash: Uint8Array;
    rewardBlockHash: Uint8Array;
    foliageBlockData: FoliageBlockData;
    foliageBlockDataSignature: Signature;
    foliageTransactionBlockHash: Uint8Array | undefined;
    foliageTransactionBlockSignature: Signature | undefined;
}
export class PoolTarget {
    free(): void;
    __getClassname(): string;
    clone(): PoolTarget;
    constructor(puzzleHash: Uint8Array, maxHeight: number);
    puzzleHash: Uint8Array;
    maxHeight: number;
}
export class BlockRecord {
    free(): void;
    __getClassname(): string;
    clone(): BlockRecord;
    constructor(headerHash: Uint8Array, prevHash: Uint8Array, height: number, weight: bigint, totalIters: bigint, signagePointIndex: number, challengeVdfOutput: Uint8Array, infusedChallengeVdfOutput: Uint8Array | undefined, rewardInfusionNewChallenge: Uint8Array, challengeBlockInfoHash: Uint8Array, subSlotIters: bigint, poolPuzzleHash: Uint8Array, farmerPuzzleHash: Uint8Array, requiredIters: bigint, deficit: number, overflow: boolean, prevTransactionBlockHeight: number, timestamp?: bigint | undefined, prevTransactionBlockHash?: Uint8Array | undefined, fees?: bigint | undefined, rewardClaimsIncorporated?: Coin[] | undefined, finishedChallengeSlotHashes?: Uint8Array[] | undefined, finishedInfusedChallengeSlotHashes?: Uint8Array[] | undefined, finishedRewardSlotHashes?: Uint8Array[] | undefined, subEpochSummaryIncluded?: SubEpochSummary | undefined);
    headerHash: Uint8Array;
    prevHash: Uint8Array;
    height: number;
    weight: bigint;
    totalIters: bigint;
    signagePointIndex: number;
    challengeVdfOutput: Uint8Array;
    infusedChallengeVdfOutput: Uint8Array | undefined;
    rewardInfusionNewChallenge: Uint8Array;
    challengeBlockInfoHash: Uint8Array;
    subSlotIters: bigint;
    poolPuzzleHash: Uint8Array;
    farmerPuzzleHash: Uint8Array;
    requiredIters: bigint;
    deficit: number;
    overflow: boolean;
    prevTransactionBlockHeight: number;
    timestamp: bigint | undefined;
    prevTransactionBlockHash: Uint8Array | undefined;
    fees: bigint | undefined;
    rewardClaimsIncorporated: Coin[] | undefined;
    finishedChallengeSlotHashes: Uint8Array[] | undefined;
    finishedInfusedChallengeSlotHashes: Uint8Array[] | undefined;
    finishedRewardSlotHashes: Uint8Array[] | undefined;
    subEpochSummaryIncluded: SubEpochSummary | undefined;
}
export class ProofOfSpace {
    free(): void;
    __getClassname(): string;
    clone(): ProofOfSpace;
    constructor(challenge: Uint8Array, poolPublicKey: PublicKey | undefined, poolContractPuzzleHash: Uint8Array | undefined, plotPublicKey: PublicKey, versionAndSize: number, proof: Uint8Array);
    challenge: Uint8Array;
    poolPublicKey: PublicKey | undefined;
    poolContractPuzzleHash: Uint8Array | undefined;
    plotPublicKey: PublicKey;
    versionAndSize: number;
    proof: Uint8Array;
}
export class SubEpochSummary {
    free(): void;
    __getClassname(): string;
    clone(): SubEpochSummary;
    constructor(prevSubepochSummaryHash: Uint8Array, rewardChainHash: Uint8Array, numBlocksOverflow: number, newDifficulty?: bigint | undefined, newSubSlotIters?: bigint | undefined, challengeMerkleRoot?: Uint8Array | undefined);
    prevSubepochSummaryHash: Uint8Array;
    rewardChainHash: Uint8Array;
    numBlocksOverflow: number;
    newDifficulty: bigint | undefined;
    newSubSlotIters: bigint | undefined;
    challengeMerkleRoot: Uint8Array | undefined;
}
export class K1SecretKey {
    free(): void;
    __getClassname(): string;
    clone(): K1SecretKey;
    static fromBytes(bytes: Uint8Array): K1SecretKey;
    toBytes(): Uint8Array;
    publicKey(): K1PublicKey;
    signPrehashed(prehashed: Uint8Array): K1Signature;
}
export class K1PublicKey {
    free(): void;
    __getClassname(): string;
    clone(): K1PublicKey;
    static fromBytes(bytes: Uint8Array): K1PublicKey;
    toBytes(): Uint8Array;
    fingerprint(): number;
    verifyPrehashed(prehashed: Uint8Array, signature: K1Signature): boolean;
}
export class K1Signature {
    free(): void;
    __getClassname(): string;
    clone(): K1Signature;
    static fromBytes(bytes: Uint8Array): K1Signature;
    toBytes(): Uint8Array;
}
export class R1SecretKey {
    free(): void;
    __getClassname(): string;
    clone(): R1SecretKey;
    static fromBytes(bytes: Uint8Array): R1SecretKey;
    toBytes(): Uint8Array;
    publicKey(): R1PublicKey;
    signPrehashed(prehashed: Uint8Array): R1Signature;
}
export class R1PublicKey {
    free(): void;
    __getClassname(): string;
    clone(): R1PublicKey;
    static fromBytes(bytes: Uint8Array): R1PublicKey;
    toBytes(): Uint8Array;
    fingerprint(): number;
    verifyPrehashed(prehashed: Uint8Array, signature: R1Signature): boolean;
}
export class R1Signature {
    free(): void;
    __getClassname(): string;
    clone(): R1Signature;
    static fromBytes(bytes: Uint8Array): R1Signature;
    toBytes(): Uint8Array;
}
export class Simulator {
    free(): void;
    __getClassname(): string;
    clone(): Simulator;
    constructor();
    static withSeed(seed: bigint): Simulator;
    height(): number;
    nextTimestamp(): bigint;
    headerHash(): Uint8Array;
    headerHashOf(height: number): Uint8Array | undefined;
    insertCoin(coin: Coin): void;
    newCoin(puzzleHash: Uint8Array, amount: bigint): Coin;
    bls(amount: bigint): BlsPairWithCoin;
    setNextTimestamp(time: bigint): void;
    passTime(time: bigint): void;
    hintCoin(coinId: Uint8Array, hint: Uint8Array): void;
    coinState(coinId: Uint8Array): CoinState | undefined;
    children(coinId: Uint8Array): CoinState[];
    hintedCoins(hint: Uint8Array): Uint8Array[];
    coinSpend(coinId: Uint8Array): CoinSpend | undefined;
    spendCoins(coinSpends: CoinSpend[], secretKeys: SecretKey[]): void;
    newTransaction(spendBundle: SpendBundle): void;
    lookupCoinIds(coinIds: Uint8Array[]): CoinState[];
    lookupPuzzleHashes(puzzleHashes: Uint8Array[], includeHints: boolean): CoinState[];
    unspentCoins(puzzleHash: Uint8Array, includeHints: boolean): Coin[];
    createBlock(): void;
}
export class BlsPair {
    free(): void;
    __getClassname(): string;
    clone(): BlsPair;
    constructor(sk: SecretKey, pk: PublicKey);
    sk: SecretKey;
    pk: PublicKey;
    static fromSeed(seed: bigint): BlsPair;
    static manyFromSeed(seed: bigint, count: number): BlsPair[];
}
export class BlsPairWithCoin {
    free(): void;
    __getClassname(): string;
    clone(): BlsPairWithCoin;
    constructor(sk: SecretKey, pk: PublicKey, puzzleHash: Uint8Array, coin: Coin);
    sk: SecretKey;
    pk: PublicKey;
    puzzleHash: Uint8Array;
    coin: Coin;
}
export class K1Pair {
    free(): void;
    __getClassname(): string;
    clone(): K1Pair;
    constructor(sk: K1SecretKey, pk: K1PublicKey);
    sk: K1SecretKey;
    pk: K1PublicKey;
    static fromSeed(seed: bigint): K1Pair;
    static manyFromSeed(seed: bigint, count: number): K1Pair[];
}
export class R1Pair {
    free(): void;
    __getClassname(): string;
    clone(): R1Pair;
    constructor(sk: R1SecretKey, pk: R1PublicKey);
    sk: R1SecretKey;
    pk: R1PublicKey;
    static fromSeed(seed: bigint): R1Pair;
    static manyFromSeed(seed: bigint, count: number): R1Pair[];
}
export class CompactCoinProof {
    free(): void;
    __getClassname(): string;
    clone(): CompactCoinProof;
    constructor(parentCoinInfo: Uint8Array, innerPuzzleHash: Uint8Array, amount: bigint);
    parentCoinInfo: Uint8Array;
    innerPuzzleHash: Uint8Array;
    amount: bigint;
}
export class XchandlesRegistryState {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesRegistryState;
    catMakerPuzzleHash: Uint8Array;
    pricingPuzzleHash: Uint8Array;
    expiredHandlePricingPuzzleHash: Uint8Array;
    static from(paymentCatTailHashHash: Uint8Array, basePrice: bigint, registrationPeriod: bigint): XchandlesRegistryState;
}
export class XchandlesConstants {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesConstants;
    launcherId: Uint8Array;
    precommitPayoutPuzzleHash: Uint8Array;
    relativeBlockHeight: number;
    priceSingletonLauncherId: Uint8Array;
    static new(launcherId: Uint8Array, precommitPayoutPuzzleHash: Uint8Array, relativeBlockHeight: number, priceSingletonLauncherId: Uint8Array): XchandlesConstants;
    withPriceSingleton(priceSingletonLauncherId: Uint8Array): XchandlesConstants;
    withLauncherId(launcherId: Uint8Array): XchandlesConstants;
}
export class XchandlesHandleSlotValue {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesHandleSlotValue;
    counter: bigint;
    handleHash: Uint8Array;
    neighbors: SlotNeigborsInfo;
    expiration: bigint;
    ownerLauncherId: Uint8Array;
    resolvedLauncherId: Uint8Array;
    static new(counter: bigint, handleHash: Uint8Array, leftHandleHash: Uint8Array, rightHandleHash: Uint8Array, expiration: bigint, ownerLauncherId: Uint8Array, resolvedLauncherId: Uint8Array): XchandlesHandleSlotValue;
}
export class XchandlesUpdateSlotValue {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesUpdateSlotValue;
    updateInitiatorCoinId: Uint8Array;
    minHeight: number;
    handleHash: Uint8Array;
    newOwnerLauncherId: Uint8Array;
    newResolvedLauncherId: Uint8Array;
    static new(updateInitiatorCoinId: Uint8Array, minHeight: number, handleHash: Uint8Array, newOwnerLauncherId: Uint8Array, newResolvedLauncherId: Uint8Array): XchandlesUpdateSlotValue;
}
export class XchandlesHandleSlot {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesHandleSlot;
    coin: Coin;
    proof: LineageProof;
    nonce: bigint;
    launcherId: Uint8Array;
    value: XchandlesHandleSlotValue;
    static new(proof: LineageProof, launcherId: Uint8Array, value: XchandlesHandleSlotValue): XchandlesHandleSlot;
    valueHash(): Uint8Array;
}
export class XchandlesUpdateSlot {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesUpdateSlot;
    coin: Coin;
    proof: LineageProof;
    nonce: bigint;
    launcherId: Uint8Array;
    value: XchandlesUpdateSlotValue;
    static new(proof: LineageProof, launcherId: Uint8Array, value: XchandlesUpdateSlotValue): XchandlesUpdateSlot;
    valueHash(): Uint8Array;
}
export class XchandlesPrecommitValue {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesPrecommitValue;
    handle: string;
    secret: Uint8Array;
    ownerLauncherId: Uint8Array;
    resolvedLauncherId: Uint8Array;
    paymentAssetId: Uint8Array;
    basePrice: bigint;
    registrationPeriod: bigint;
    buyTime: bigint;
    numPeriods: bigint;
    currentExpiration: bigint;
    useExpirePricing: boolean;
    static forNormalRegistration(handle: string, secret: Uint8Array, ownerLauncherId: Uint8Array, resolvedLauncherId: Uint8Array, paymentAssetId: Uint8Array, basePrice: bigint, registrationPeriod: bigint, buyTime: bigint, numPeriods: bigint): XchandlesPrecommitValue;
    static forExpiryPricingRegistration(handle: string, secret: Uint8Array, ownerLauncherId: Uint8Array, resolvedLauncherId: Uint8Array, paymentAssetId: Uint8Array, basePrice: bigint, registrationPeriod: bigint, buyTime: bigint, currentExpiration: bigint, numPeriods: bigint): XchandlesPrecommitValue;
    commitmentHash(): Uint8Array;
}
export class XchandlesPrecommitCoin {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesPrecommitCoin;
    coin: Coin;
    assetId: Uint8Array;
    proof: LineageProof;
    innerPuzzleHash: Uint8Array;
    value: XchandlesPrecommitValue;
    static new(clvm: Clvm, parentCoinId: Uint8Array, proof: LineageProof, assetId: Uint8Array, controllerSingletonLauncherId: Uint8Array, relativeBlockHeight: number, payoutPuzzleHash: Uint8Array, refundPuzzleHash: Uint8Array, value: XchandlesPrecommitValue, precommitAmount: bigint): XchandlesPrecommitCoin;
    static puzzleHash(assetId: Uint8Array, controllerSingletonLauncherId: Uint8Array, relativeBlockHeight: number, payoutPuzzleHash: Uint8Array, refundPuzzleHash: Uint8Array, value: XchandlesPrecommitValue): Uint8Array;
}
export class XchandlesRegistryFinishedSpendResult {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesRegistryFinishedSpendResult;
    constructor(newRegistry: XchandlesRegistry, signature: Signature);
    newRegistry: XchandlesRegistry;
    signature: Signature;
}
export class XchandlesRegistryLaunchResult {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesRegistryLaunchResult;
    constructor(securitySignature: Signature, securitySecretKey: SecretKey, registry: XchandlesRegistry, slots: XchandlesHandleSlot[], securityCoin: Coin);
    securitySignature: Signature;
    securitySecretKey: SecretKey;
    registry: XchandlesRegistry;
    slots: XchandlesHandleSlot[];
    securityCoin: Coin;
}
export class XchandlesRegistryInfoFromLauncher {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesRegistryInfoFromLauncher;
    constructor(registry: XchandlesRegistry, initialSlots: XchandlesHandleSlot[], initialRegistrationAssetId: Uint8Array, initialBasePrice: bigint);
    registry: XchandlesRegistry;
    initialSlots: XchandlesHandleSlot[];
    initialRegistrationAssetId: Uint8Array;
    initialBasePrice: bigint;
}
export class XchandlesTripleConditionsResult {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesTripleConditionsResult;
    constructor(registryConditions: Program[], ownerConditions: Program[], resolvedConditions?: Program[] | undefined);
    registryConditions: Program[];
    ownerConditions: Program[];
    resolvedConditions: Program[] | undefined;
}
export class XchandlesExtendResult {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesExtendResult;
    constructor(conditions: Program[], notarizedPayment: NotarizedPayment);
    conditions: Program[];
    notarizedPayment: NotarizedPayment;
}
export class XchandlesExecuteUpdateResult {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesExecuteUpdateResult;
    constructor(registryConditions: Program[], oldOwnerConditions: Program[], newOwnerConditions: Program[]);
    registryConditions: Program[];
    oldOwnerConditions: Program[];
    newOwnerConditions: Program[];
}
export class XchandlesRegistryActualNeighborsResult {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesRegistryActualNeighborsResult;
    constructor(leftSlot: XchandlesHandleSlot, rightSlot: XchandlesHandleSlot);
    leftSlot: XchandlesHandleSlot;
    rightSlot: XchandlesHandleSlot;
}
export class XchandlesRegistry {
    free(): void;
    __getClassname(): string;
    clone(): XchandlesRegistry;
    coin(): Coin;
    proof(): Proof;
    state(): XchandlesRegistryState;
    constants(): XchandlesConstants;
    innerPuzzleHash(): Uint8Array;
    puzzleHash(): Uint8Array;
    pendingCreatedHandleSlots(): XchandlesHandleSlot[];
    pendingCreatedUpdateSlots(): XchandlesUpdateSlot[];
    pendingSignature(): Signature;
    finishSpend(): XchandlesRegistryFinishedSpendResult;
    register(leftSlot: XchandlesHandleSlot, rightSlot: XchandlesHandleSlot, precommitCoin: XchandlesPrecommitCoin, baseHandlePrice: bigint, registrationPeriod: bigint, startTime: bigint, ownerInnerPuzzleHash: Uint8Array, resolvedInnerPuzzleHash: Uint8Array): XchandlesTripleConditionsResult;
    refundWithPricing(precommitCoin: XchandlesPrecommitCoin, pricingPuzzleReveal: Program, pricingPuzzleSolution: Program, slot?: XchandlesHandleSlot | undefined): Program[];
    refund(precommitCoin: XchandlesPrecommitCoin, slot?: XchandlesHandleSlot | undefined): Program[];
    extend(handle: string, slot: XchandlesHandleSlot, paymentAssetId: Uint8Array, baseHandlePrice: bigint, registrationPeriod: bigint, numPeriods: bigint, buyTime: bigint): XchandlesExtendResult;
    expire(slot: XchandlesHandleSlot, numPeriods: bigint, baseHandlePrice: bigint, registrationPeriod: bigint, precommitCoin: XchandlesPrecommitCoin, startTime: bigint, newOwnerInnerPuzzleHash: Uint8Array, newResolvedInnerPuzzleHash: Uint8Array): XchandlesTripleConditionsResult;
    oracle(slot: XchandlesHandleSlot): Program[];
    initiateUpdate(slot: XchandlesHandleSlot, newOwnerLauncherId: Uint8Array, newResolvedLauncherId: Uint8Array, currentOwner: CompactCoinProof, minHeight: number): Program[];
    executeUpdate(handleSlot: XchandlesHandleSlot, updateSlot: XchandlesUpdateSlot, newOwnerLauncherId: Uint8Array, newResolvedLauncherId: Uint8Array, currentOwner: CompactCoinProof, newOwnerInnerPuzzleHash: Uint8Array, newResolvedInnerPuzzleHash: Uint8Array): XchandlesExecuteUpdateResult;
    delegatedState(newState: XchandlesRegistryState, otherSingletonInnerPuzzleHash: Uint8Array): Program[];
    actualNeighbors(newHandleHash: Uint8Array, onChainLeftSlot: XchandlesHandleSlot, onChainRightSlot: XchandlesHandleSlot): XchandlesRegistryActualNeighborsResult;
    actualHandleSlot(slot: XchandlesHandleSlot): XchandlesHandleSlot;
    actualUpdateSlot(slot: XchandlesUpdateSlot): XchandlesUpdateSlot;
    static parseLauncherSolution(launcherCoin: Coin, launcherSolution: Program): XchandlesRegistryInfoFromLauncher | undefined;
}

export type RewardDistributorActionLogValue =
  | (RewardDistributorActionLog & { kind: "AddEntry"; addEntry: RewardDistributorAddEntryActionLog })
  | (RewardDistributorActionLog & { kind: "RemoveEntry"; removeEntry: RewardDistributorRemoveEntryActionLog })
  | (RewardDistributorActionLog & { kind: "AddIncentives"; addIncentives: RewardDistributorAddIncentivesActionLog })
  | (RewardDistributorActionLog & { kind: "CommitIncentives"; commitIncentives: RewardDistributorCommitIncentivesActionLog })
  | (RewardDistributorActionLog & { kind: "InitiatePayout"; initiatePayout: RewardDistributorInitiatePayoutActionLog })
  | (RewardDistributorActionLog & { kind: "NewEpoch"; newEpoch: RewardDistributorNewEpochActionLog })
  | (RewardDistributorActionLog & { kind: "Sync"; sync: RewardDistributorSyncActionLog })
  | (RewardDistributorActionLog & { kind: "WithdrawIncentives"; withdrawIncentives: RewardDistributorWithdrawIncentivesActionLog })
  | (RewardDistributorActionLog & { kind: "RefreshNftsFromDl"; refreshNftsFromDl: RewardDistributorRefreshNftsFromDlActionLog })
  | (RewardDistributorActionLog & { kind: "Stake"; stake: RewardDistributorStakeActionLog })
  | (RewardDistributorActionLog & { kind: "Unstake"; unstake: RewardDistributorUnstakeActionLog });

