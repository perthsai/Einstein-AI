public with sharing class AccountListController {

    public class AccountListResult {
        @AuraEnabled public List<Account> accounts;
        @AuraEnabled public Integer totalCount;
    }

    @AuraEnabled(cacheable=true)
    public static AccountListResult getAccounts(Integer displayCount) {
        AccountListResult result = new AccountListResult();
        result.totalCount = [SELECT COUNT() FROM Account WITH USER_MODE];
        result.accounts = [
            SELECT Id, Name, Industry, Phone, AnnualRevenue, Rating
            FROM Account
            WITH USER_MODE
            ORDER BY Name ASC
            LIMIT :displayCount
        ];
        return result;
    }
}
