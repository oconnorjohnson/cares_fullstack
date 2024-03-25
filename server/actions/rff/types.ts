export type FundDetail = {
  id: number;
  fundTypeId: number;
  amount: number;
  AssetIds?: number[] | null;
};

export type FundTypeHandlers = {
  [key: number]: (fund: FundDetail) => Promise<boolean>;
};

export type ExpendTypeHandlers = {
  [key: number]: (
    asset: number | null,
    fundId: number,
    fund: FundDetail,
  ) => Promise<boolean>;
};

export type FundTypeTransactionHandlers = {
  [key: number]: (
    fund: FundDetail,
    requestId: number,
    UserId: string,
  ) => Promise<boolean>;
};
