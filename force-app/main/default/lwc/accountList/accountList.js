import { LightningElement, api, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountListController.getAccounts';

const AVATAR_COLORS = ['#1589EE', '#9C27B0', '#F44336', '#4CAF50', '#FF9800', '#00BCD4', '#E91E63'];

const RATING_CONFIG = {
    Hot: { cssClass: 'rating-hot', emoji: '🔥' },
    Warm: { cssClass: 'rating-warm', emoji: '' },
    Cold: { cssClass: 'rating-cold', emoji: '' }
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

export default class AccountList extends LightningElement {
    @api displayCount = 3;

    @track accounts = [];
    @track totalCount = 0;
    @track isLoading = true;
    @track errorMessage = '';

    connectedCallback() {
        getAccounts({ displayCount: this.displayCount })
            .then(result => {
                this.accounts = result.accounts;
                this.totalCount = result.totalCount;
                this.isLoading = false;
            })
            .catch(error => {
                this.errorMessage = error?.body?.message || 'An error occurred loading accounts.';
                this.isLoading = false;
            });
    }

    get enrichedAccounts() {
        return this.accounts.map(account => {
            const name = account.Name || '';
            const colorIndex = name.charCodeAt(0) % AVATAR_COLORS.length;
            const ratingConfig = RATING_CONFIG[account.Rating] || { cssClass: 'rating-default', emoji: '' };

            return {
                ...account,
                initial: name.charAt(0).toUpperCase(),
                avatarStyle: `background-color: ${AVATAR_COLORS[colorIndex]};`,
                formattedRevenue: account.AnnualRevenue ? currencyFormatter.format(account.AnnualRevenue) : '—',
                ratingClass: ratingConfig.cssClass,
                ratingEmoji: ratingConfig.emoji
            };
        });
    }

    get hasAccounts() {
        return !this.isLoading && this.accounts.length > 0;
    }

    get hasError() {
        return !this.isLoading && this.errorMessage.length > 0;
    }

    get shownCount() {
        return this.accounts.length;
    }
}
