// Data Manager - Handles all data operations and localStorage
export class DataManager {
    constructor() {
        this.members = this.loadFromStorage('members') || [];
        this.contributions = this.loadFromStorage('contributions') || [];
        this.savings = this.loadFromStorage('savings') || [];
        this.settings = this.loadFromStorage('settings') || {};
        this.departedMembers = this.loadFromStorage('departedMembers') || [];
        this.beneficiaries = this.loadFromStorage('beneficiaries') || [];
        this.savingsCounter = this.loadFromStorage('savingsCounter') || 1;
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(`familyManagement_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key} from storage:`, error);
            return null;
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(`familyManagement_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving ${key} to storage:`, error);
        }
    }

    // Members
    getMembers() {
        return this.members.filter(member => member.status !== 'departed');
    }

    getMember(id) {
        return this.members.find(member => member.id === id);
    }

    saveMember(member) {
        // Ensure member has proper ID format
        if (!member.id || !member.id.startsWith('MEMB-')) {
            const members = this.getMembers();
            const existingIds = members.map(m => m.id).filter(id => id && id.startsWith('MEMB-'));
            let nextNumber = 1;

            if (existingIds.length > 0) {
                const numbers = existingIds.map(id => parseInt(id.replace('MEMB-', '')));
                nextNumber = Math.max(...numbers) + 1;
            }

            member.id = `MEMB-${nextNumber.toString().padStart(3, '0')}`;
        }

        const existingIndex = this.members.findIndex(m => m.id === member.id);
        if (existingIndex >= 0) {
            this.members[existingIndex] = member;
        } else {
            this.members.push(member);
        }
        this.saveToStorage('members', this.members);
    }

    departMember(memberId, reason) {
        const member = this.getMember(memberId);
        if (member) {
            // Add to departed members
            this.departedMembers.push({
                ...member,
                departureDate: new Date().toISOString(),
                reason: reason
            });

            // Update member status
            member.status = 'departed';
            this.saveToStorage('members', this.members);
            this.saveToStorage('departedMembers', this.departedMembers);
        }
    }

    getSeniorMembers() {
        return this.members.filter(member => member.status === 'senior')
            .map(member => ({
                ...member,
                yearsOfService: this.calculateYearsOfService(member.joinDate)
            }));
    }

    calculateYearsOfService(joinDate) {
        const join = new Date(joinDate);
        const now = new Date();
        const years = now.getFullYear() - join.getFullYear();
        const months = now.getMonth() - join.getMonth();
        return months < 0 ? years - 1 : years;
    }

    getDepartedMembers() {
        return this.departedMembers;
    }

    // Beneficiaries
    getBeneficiaries() {
        return this.beneficiaries;
    }

    saveBeneficiary(beneficiary) {
        this.beneficiaries.push(beneficiary);
        this.saveToStorage('beneficiaries', this.beneficiaries);
    }

    deleteBeneficiary(beneficiaryId) {
        this.beneficiaries = this.beneficiaries.filter(b => b.id !== beneficiaryId);
        this.saveToStorage('beneficiaries', this.beneficiaries);
    }

    getBeneficiary(id) {
        return this.beneficiaries.find(b => b.id === id);
    }

    // Contributions with beneficiary structure
    getContributionByMemberAndBeneficiary(memberId, beneficiaryId) {
        return this.contributions.find(c => 
            c.memberId === memberId && c.beneficiaryId === beneficiaryId
        );
    }

    saveContributionWithBeneficiary(contribution) {
        // Check if contribution already exists for this member-beneficiary pair
        const existingIndex = this.contributions.findIndex(c => 
            c.memberId === contribution.memberId && c.beneficiaryId === contribution.beneficiaryId
        );

        if (existingIndex >= 0) {
            this.contributions[existingIndex] = contribution;
        } else {
            this.contributions.push(contribution);
        }
        this.saveToStorage('contributions', this.contributions);
    }

    deleteContribution(memberId, beneficiaryId) {
        this.contributions = this.contributions.filter(c => 
            !(c.memberId === memberId && c.beneficiaryId === beneficiaryId)
        );
        this.saveToStorage('contributions', this.contributions);
    }

    // Contributions (legacy)
    getContributions(type = null) {
        if (type) {
            return this.contributions.filter(c => c.type === type);
        }
        return this.contributions;
    }

    saveContribution(contribution) {
        this.contributions.push(contribution);
        this.saveToStorage('contributions', this.contributions);
    }

    deleteContributionLegacy(id) {
        this.contributions = this.contributions.filter(c => c.id !== id);
        this.saveToStorage('contributions', this.contributions);
    }

    // Savings with new ID format
    getSavings() {
        return this.savings.map(saving => ({
            ...saving,
            id: saving.id.startsWith('SAV-') ? saving.id : `SAV-${saving.id.padStart(3, '0')}`
        }));
    }

    saveSaving(saving) {
        // Ensure saving has proper ID format
        if (!saving.id || !saving.id.startsWith('SAV-')) {
            saving.id = `SAV-${this.savingsCounter.toString().padStart(3, '0')}`;
            this.savingsCounter++;
            this.saveToStorage('savingsCounter', this.savingsCounter);
        }

        this.savings.push(saving);
        this.saveToStorage('savings', this.savings);
    }

    deleteSaving(id) {
        this.savings = this.savings.filter(s => s.id !== id);
        this.saveToStorage('savings', this.savings);
    }

    // Settings
    getSettings() {
        return {
            currency: 'KES',
            ...this.settings
        };
    }

    saveSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        this.saveToStorage('settings', this.settings);
    }

    getSetting(key) {
        return this.settings[key];
    }

    // Data Management
    exportData() {
        const data = {
            members: this.members,
            contributions: this.contributions,
            savings: this.savings,
            beneficiaries: this.beneficiaries,
            departedMembers: this.departedMembers,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            if (data.members) {
                this.members = data.members;
                this.saveToStorage('members', this.members);
            }

            if (data.contributions) {
                this.contributions = data.contributions;
                this.saveToStorage('contributions', this.contributions);
            }

            if (data.savings) {
                this.savings = data.savings;
                this.saveToStorage('savings', this.savings);
            }

            if (data.beneficiaries) {
                this.beneficiaries = data.beneficiaries;
                this.saveToStorage('beneficiaries', this.beneficiaries);
            }

            if (data.departedMembers) {
                this.departedMembers = data.departedMembers;
                this.saveToStorage('departedMembers', this.departedMembers);
            }

            if (data.settings) {
                this.settings = data.settings;
                this.saveToStorage('settings', this.settings);
            }

            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    clearAllData() {
        this.members = [];
        this.contributions = [];
        this.savings = [];
        this.beneficiaries = [];
        this.departedMembers = [];
        this.settings = {};
        this.savingsCounter = 1;

        this.saveToStorage('members', this.members);
        this.saveToStorage('contributions', this.contributions);
        this.saveToStorage('savings', this.savings);
        this.saveToStorage('beneficiaries', this.beneficiaries);
        this.saveToStorage('departedMembers', this.departedMembers);
        this.saveToStorage('settings', this.settings);
        this.saveToStorage('savingsCounter', this.savingsCounter);
    }

    // Dashboard Stats
    getDashboardStats() {
        const totalMembers = this.getMembers().length;
        const totalSavings = this.savings.reduce((sum, s) => sum + s.amount, 0);
        const totalContributions = this.contributions.reduce((sum, c) => sum + c.amount, 0);

        // Get unique contributors in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentContributors = new Set(
            this.contributions
                .filter(c => new Date(c.date) >= thirtyDaysAgo)
                .map(c => c.memberId)
        );

        // Prepare chart data by beneficiary category
        const categories = ['benevolence', 'education', 'health', 'charity'];
        const contributionData = {
            labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
            datasets: [{
                label: 'Contributions (KES)',
                data: categories.map(cat => 
                    this.contributions
                        .filter(c => this.getBeneficiary(c.beneficiaryId)?.category === cat)
                        .reduce((sum, c) => sum + c.amount, 0)
                ),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
            }]
        };

        return {
            totalMembers,
            totalSavings,
            totalContributions,
            activeContributors: recentContributors.size,
            contributionData
        };
    }
}