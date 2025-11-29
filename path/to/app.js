// Family Management App - Updated with beneficiary structure
import { DataManager } from './dataManager.js';
import { UIManager } from './uiManager.js';
import { ChartManager } from './chartManager.js';

class FamilyManagementApp {
    constructor() {
        this.dataManager = new DataManager();
        this.uiManager = new UIManager();
        this.chartManager = new ChartManager();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.loadMembers();
        this.loadContributions();
        this.loadSavings();
        this.updateDate();

        // Update date every minute
        setInterval(() => this.updateDate(), 60000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
        });

        // Modals - Add null checks
        const addMemberBtn = document.getElementById('addMemberBtn');
        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', () => this.openMemberModal());
        }

        const addContributionBtn = document.getElementById('addContributionBtn');
        if (addContributionBtn) {
            addContributionBtn.addEventListener('click', () => this.openContributionModal());
        }

        const addSavingBtn = document.getElementById('addSavingBtn');
        if (addSavingBtn) {
            addSavingBtn.addEventListener('click', () => this.openSavingModal());
        }

        const addBeneficiaryBtn = document.getElementById('addBeneficiaryBtn');
        if (addBeneficiaryBtn) {
            addBeneficiaryBtn.addEventListener('click', () => this.openBeneficiaryModal());
        }

        // Close modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Contribution type buttons - Add null check
        const contributionTypeBtns = document.querySelectorAll('[data-type]');
        if (contributionTypeBtns.length > 0) {
            contributionTypeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => this.switchContributionType(e.target.dataset.type));
            });
        }

        // Forms - Add null checks
        const memberForm = document.getElementById('memberForm');
        if (memberForm) {
            memberForm.addEventListener('submit', (e) => this.handleMemberForm(e));
        }

        const contributionForm = document.getElementById('contributionForm');
        if (contributionForm) {
            contributionForm.addEventListener('submit', (e) => this.handleContributionForm(e));
        }

        const savingForm = document.getElementById('savingForm');
        if (savingForm) {
            savingForm.addEventListener('submit', (e) => this.handleSavingForm(e));
        }

        const beneficiaryForm = document.getElementById('beneficiaryForm');
        if (beneficiaryForm) {
            beneficiaryForm.addEventListener('submit', (e) => this.handleBeneficiaryForm(e));
        }

        const contributionCellForm = document.getElementById('contributionCellForm');
        if (contributionCellForm) {
            contributionCellForm.addEventListener('submit', (e) => this.handleContributionCellForm(e));
        }

        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }

        // Data management buttons
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportData());
        }

        const importDataBtn = document.getElementById('importDataBtn');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => this.importData());
        }

        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => this.handleFileImport(e));
        }

        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.clearAllData());
        }

        // Delete contribution and receipt buttons
        const deleteContributionBtn = document.getElementById('deleteContributionBtn');
        if (deleteContributionBtn) {
            deleteContributionBtn.addEventListener('click', () => this.deleteContributionFromCell());
        }

        const receiptBtn = document.getElementById('receiptBtn');
        if (receiptBtn) {
            receiptBtn.addEventListener('click', () => this.generateReceipt());
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        const quickContributionForm = document.getElementById('quickContributionForm');
        if (quickContributionForm) {
            quickContributionForm.addEventListener('submit', (e) => this.handleQuickContributionForm(e));
        }
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById(sectionName).classList.add('active');

        // Load section-specific data
        if (sectionName === 'senior') {
            this.loadSeniorMembers();
        } else if (sectionName === 'departed') {
            this.loadDepartedMembers();
        }
    }

    switchContributionType(type) {
        // This method is now obsolete but kept for compatibility
        this.currentContributionType = type;
        document.querySelectorAll('[data-type]').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
    }

    updateDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    }

    updateDashboard() {
        const stats = this.dataManager.getDashboardStats();

        document.getElementById('totalMembers').textContent = stats.totalMembers;
        document.getElementById('totalSavings').textContent = this.formatCurrency(stats.totalSavings);
        document.getElementById('totalContributions').textContent = this.formatCurrency(stats.totalContributions);
        document.getElementById('activeContributors').textContent = stats.activeContributors;

        // Update chart
        this.chartManager.updateChart(stats.contributionData);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    }

    generateMemberId() {
        const members = this.dataManager.getMembers();
        const existingIds = members.map(m => m.id).filter(id => id.startsWith('MEMB-'));
        let nextNumber = 1;

        if (existingIds.length > 0) {
            const numbers = existingIds.map(id => parseInt(id.replace('MEMB-', '')));
            nextNumber = Math.max(...numbers) + 1;
        }

        return `MEMB-${nextNumber.toString().padStart(3, '0')}`;
    }

    loadMembers() {
        const members = this.dataManager.getMembers();
        const tbody = document.getElementById('membersTableBody');

        tbody.innerHTML = members.map(member => {
            const age = this.dataManager.calculateAge(member.dateOfBirth);
            return `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>${age}</td>
                <td>${new Date(member.joinDate).toLocaleDateString()}</td>
                <td><span class="status ${member.status}">${member.status}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn-secondary btn-sm" onclick="app.editMember('${member.id}')">Edit</button>
                        <button class="btn-secondary btn-sm" onclick="app.departMember('${member.id}')">Depart</button>
                        <button class="btn-secondary btn-sm" onclick="app.quickContribute('${member.id}', '${member.name}')">Contribute</button>
                    </div>
                </td>
            </tr>
        `;
        }).join('');
    }

    loadContributions() {
        const members = this.dataManager.getMembers();
        const beneficiaries = this.dataManager.getBeneficiaries();
        const thead = document.getElementById('contributionsHeader');
        const tbody = document.getElementById('contributionsTableBody');

        // Build header with beneficiaries and actions
        thead.innerHTML = `
            <tr>
                <th>Member ID</th>
                <th>Member Name</th>
                ${beneficiaries.map(b => `<th>${b.name} <button class="btn-secondary btn-sm" onclick="app.deleteBeneficiary('${b.id}')">Delete</button></th>`).join('')}
            </tr>
        `;

        // Build table body
        tbody.innerHTML = members.map(member => {
            const row = document.createElement('tr');
            let rowHtml = `
                <td>${member.id}</td>
                <td>${member.name}</td>
            `;

            beneficiaries.forEach(beneficiary => {
                const contribution = this.dataManager.getContributionByMemberAndBeneficiary(member.id, beneficiary.id);
                const amount = contribution ? contribution.amount : 0;
                rowHtml += `
                    <td class="contribution-cell" 
                        onclick="app.openContributionCellModal('${member.id}', '${member.name}', '${beneficiary.id}', '${beneficiary.name}')"
                        style="cursor: pointer; text-align: center;">
                        ${this.formatCurrency(amount)}
                    </td>
                `;
            });

            rowHtml += '</tr>';
            return rowHtml;
        }).join('');
    }

    loadSavings() {
        const savings = this.dataManager.getSavings();
        const tbody = document.getElementById('savingsTableBody');

        tbody.innerHTML = savings.map(saving => `
            <tr>
                <td>${saving.id}</td>
                <td>${saving.memberName}</td>
                <td>${this.formatCurrency(saving.amount)}</td>
                <td>${new Date(saving.date).toLocaleDateString()}</td>
                <td>
                    <button class="btn-secondary btn-sm" onclick="app.deleteSaving('${saving.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    loadSeniorMembers() {
        const seniors = this.dataManager.getSeniorMembers();
        const tbody = document.getElementById('seniorTableBody');

        tbody.innerHTML = seniors.map(member => `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.age}</td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>${new Date(member.joinDate).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }

    loadDepartedMembers() {
        const departed = this.dataManager.getDepartedMembers();
        const tbody = document.getElementById('departedTableBody');

        tbody.innerHTML = departed.map(member => `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${new Date(member.joinDate).toLocaleDateString()}</td>
                <td>${new Date(member.departureDate).toLocaleDateString()}</td>
                <td style="max-width: 300px; word-wrap: break-word;">${member.eulogy || 'No eulogy recorded'}</td>
            </tr>
        `).join('');
    }

    openMemberModal(memberId = null) {
        const modal = document.getElementById('memberModal');
        const form = document.getElementById('memberForm');

        if (memberId) {
            const member = this.dataManager.getMember(memberId);
            document.getElementById('memberId').value = member.id;
            document.getElementById('memberName').value = member.name;
            document.getElementById('memberEmail').value = member.email;
            document.getElementById('memberPhone').value = member.phone;
            document.getElementById('memberDOB').value = member.dateOfBirth;
            document.getElementById('memberStatus').value = member.status;
        } else {
            form.reset();
            document.getElementById('memberId').value = '';
        }

        modal.style.display = 'block';
    }

    openContributionModal(memberId = null) {
        const modal = document.getElementById('contributionModal');
        const select = document.getElementById('contributionMember');

        // Populate member options
        const members = this.dataManager.getMembers();
        select.innerHTML = members.map(member => 
            `<option value="${member.id}">${member.name}</option>`
        ).join('');

        // Pre-select member if provided
        if (memberId) {
            select.value = memberId;
        }

        document.getElementById('contributionType').value = this.currentContributionType;
        modal.style.display = 'block';
    }

    openSavingModal() {
        const modal = document.getElementById('savingModal');
        const select = document.getElementById('savingMember');

        // Populate member options
        const members = this.dataManager.getMembers();
        select.innerHTML = members.map(member => 
            `<option value="${member.id}">${member.name}</option>`
        ).join('');

        modal.style.display = 'block';
    }

    openBeneficiaryModal() {
        const modal = document.getElementById('beneficiaryModal');
        document.getElementById('beneficiaryForm').reset();
        modal.style.display = 'block';
    }

    openContributionCellModal(memberId, memberName, beneficiaryId, beneficiaryName) {
        const modal = document.getElementById('contributionCellModal');
        const existingContribution = this.dataManager.getContributionByMemberAndBeneficiary(memberId, beneficiaryId);

        document.getElementById('cellMemberId').value = memberId;
        document.getElementById('cellBeneficiary').value = beneficiaryId;
        document.getElementById('cellMemberName').value = memberName;
        document.getElementById('cellBeneficiaryName').value = beneficiaryName;
        document.getElementById('cellContributionAmount').value = existingContribution ? existingContribution.amount : '';

        // Show/hide delete button based on existing contribution
        const deleteBtn = document.getElementById('deleteContributionBtn');
        if (existingContribution) {
            deleteBtn.style.display = 'block';
        } else {
            deleteBtn.style.display = 'none';
        }

        modal.style.display = 'block';
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }

    handleMemberForm(e) {
        e.preventDefault();

        const memberId = document.getElementById('memberId').value;
        const memberData = {
            id: memberId || this.generateMemberId(),
            name: document.getElementById('memberName').value,
            email: document.getElementById('memberEmail').value,
            phone: document.getElementById('memberPhone').value,
            dateOfBirth: document.getElementById('memberDOB').value,
            status: document.getElementById('memberStatus').value,
            joinDate: new Date().toISOString()
        };

        this.dataManager.saveMember(memberData);
        this.loadMembers();
        this.updateDashboard();
        this.closeModal(document.getElementById('memberModal'));

        this.uiManager.showMessage('Member saved successfully!', 'success');
    }

    handleContributionForm(e) {
        e.preventDefault();

        const contributionData = {
            id: Date.now().toString(),
            memberId: document.getElementById('contributionMember').value,
            memberName: document.getElementById('contributionMember').selectedOptions[0].text,
            amount: parseFloat(document.getElementById('contributionAmount').value),
            type: document.getElementById('contributionType').value,
            date: new Date().toISOString()
        };

        this.dataManager.saveContribution(contributionData);
        this.loadContributions();
        this.updateDashboard();
        this.closeModal(document.getElementById('contributionModal'));

        this.uiManager.showMessage('Contribution saved successfully!', 'success');
    }

    handleSavingForm(e) {
        e.preventDefault();

        const savingData = {
            id: '',
            memberId: document.getElementById('savingMember').value,
            memberName: document.getElementById('savingMember').selectedOptions[0].text,
            amount: parseFloat(document.getElementById('savingAmount').value),
            date: new Date().toISOString()
        };

        this.dataManager.saveSaving(savingData);
        this.loadSavings();
        this.updateDashboard();
        this.closeModal(document.getElementById('savingModal'));

        this.uiManager.showMessage('Saving saved successfully!', 'success');
    }

    handleBeneficiaryForm(e) {
        e.preventDefault();

        const beneficiaryData = {
            id: Date.now().toString(),
            name: document.getElementById('beneficiaryName').value,
            category: document.getElementById('beneficiaryCategory').value
        };

        this.dataManager.saveBeneficiary(beneficiaryData);
        this.loadContributions();
        this.closeModal(document.getElementById('beneficiaryModal'));

        this.uiManager.showMessage('Beneficiary added successfully!', 'success');
    }

    handleContributionCellForm(e) {
        e.preventDefault();

        const contributionData = {
            memberId: document.getElementById('cellMemberId').value,
            beneficiaryId: document.getElementById('cellBeneficiary').value,
            amount: parseFloat(document.getElementById('cellContributionAmount').value),
            date: new Date().toISOString()
        };

        this.dataManager.saveContributionWithBeneficiary(contributionData);
        this.loadContributions();
        this.updateDashboard();
        this.closeModal(document.getElementById('contributionCellModal'));

        this.uiManager.showMessage('Contribution saved successfully!', 'success');
    }

    deleteContributionFromCell() {
        const memberId = document.getElementById('cellMemberId').value;
        const beneficiaryId = document.getElementById('cellBeneficiary').value;

        if (confirm('Are you sure you want to delete this contribution?')) {
            this.dataManager.deleteContribution(memberId, beneficiaryId);
            this.loadContributions();
            this.updateDashboard();
            this.closeModal(document.getElementById('contributionCellModal'));
            this.uiManager.showMessage('Contribution deleted successfully!', 'success');
        }
    }

    deleteBeneficiary(beneficiaryId) {
        if (confirm('Are you sure you want to delete this beneficiary? This will also delete all associated contributions.')) {
            this.dataManager.deleteBeneficiary(beneficiaryId);
            this.loadContributions();
            this.uiManager.showMessage('Beneficiary deleted successfully!', 'success');
        }
    }

    generateReceipt() {
        const memberId = document.getElementById('cellMemberId').value;
        const beneficiaryId = document.getElementById('cellBeneficiary').value;
        const amount = document.getElementById('cellContributionAmount').value;
        const memberName = document.getElementById('cellMemberName').value;
        const beneficiaryName = document.getElementById('cellBeneficiaryName').value;

        const receipt = {
            memberId,
            memberName,
            beneficiaryId,
            beneficiaryName,
            amount: parseFloat(amount),
            date: new Date().toISOString(),
            receiptNumber: `RCP-${Date.now()}`
        };

        // Generate and download receipt
        const receiptContent = `
FAMILY MANAGEMENT SYSTEM RECEIPT
================================
Receipt #: ${receipt.receiptNumber}
Date: ${new Date(receipt.date).toLocaleDateString()}
Time: ${new Date(receipt.date).toLocaleTimeString()}

MEMBER DETAILS
--------------
ID: ${receipt.memberId}
Name: ${receipt.memberName}

CONTRIBUTION DETAILS
-------------------
Beneficiary: ${receipt.beneficiaryName}
Amount: ${this.formatCurrency(receipt.amount)}
Currency: KES

Thank you for your contribution!
Generated on: ${new Date().toLocaleString()}
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${receipt.receiptNumber}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        this.uiManager.showMessage('Receipt generated and downloaded!', 'success');
    }

    editMember(memberId) {
        this.openMemberModal(memberId);
    }

    departMember(memberId) {
        if (confirm('Are you sure you want to mark this member as departed?')) {
            const reason = prompt('Please enter the reason for departure:');
            if (reason) {
                const eulogy = prompt('Please enter a eulogy for this member:');
                this.dataManager.departMember(memberId, reason, eulogy || '');
                this.loadMembers();
                this.updateDashboard();
                this.uiManager.showMessage('Member departed successfully!', 'success');
            }
        }
    }

    quickContribute(memberId, memberName) {
        const modal = document.getElementById('quickContributionModal');
        const beneficiaries = this.dataManager.getBeneficiaries();
        const select = document.getElementById('quickBeneficiary');

        document.getElementById('quickMemberId').value = memberId;
        document.getElementById('quickMemberName').value = memberName;

        // Populate beneficiary options
        select.innerHTML = beneficiaries.map(b => 
            `<option value="${b.id}">${b.name}</option>`
        ).join('');

        if (beneficiaries.length === 0) {
            this.uiManager.showMessage('Please add beneficiaries first!', 'error');
            return;
        }

        modal.style.display = 'block';
    }

    handleQuickContributionForm(e) {
        e.preventDefault();

        const contributionData = {
            memberId: document.getElementById('quickMemberId').value,
            beneficiaryId: document.getElementById('quickBeneficiary').value,
            amount: parseFloat(document.getElementById('quickContributionAmount').value),
            date: new Date().toISOString()
        };

        this.dataManager.saveContributionWithBeneficiary(contributionData);
        this.loadContributions();
        this.updateDashboard();
        this.closeModal(document.getElementById('quickContributionModal'));

        this.uiManager.showMessage('Contribution saved successfully!', 'success');
    }

    deleteContribution(contributionId) {
        if (confirm('Are you sure you want to delete this contribution?')) {
            this.dataManager.deleteContributionLegacy(contributionId);
            this.loadContributions();
            this.updateDashboard();
            this.uiManager.showMessage('Contribution deleted successfully!', 'success');
        }
    }

    deleteSaving(savingId) {
        if (confirm('Are you sure you want to delete this saving?')) {
            this.dataManager.deleteSaving(savingId);
            this.loadSavings();
            this.updateDashboard();
            this.uiManager.showMessage('Saving deleted successfully!', 'success');
        }
    }

    saveSettings() {
        const settings = {
            familyName: document.getElementById('familyName').value,
            currency: document.getElementById('currency').value,
            emailNotifications: document.getElementById('emailNotifications').checked,
            contributionReminders: document.getElementById('contributionReminders').checked
        };

        this.dataManager.saveSettings(settings);
        this.uiManager.showMessage('Settings saved successfully!', 'success');
    }

    exportData() {
        const data = this.dataManager.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `family_management_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.uiManager.showMessage('Data exported successfully!', 'success');
    }

    importData() {
        document.getElementById('importFile').click();
    }

    handleFileImport(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const success = this.dataManager.importData(e.target.result);
                if (success) {
                    this.loadMembers();
                    this.loadContributions();
                    this.loadSavings();
                    this.updateDashboard();
                    this.uiManager.showMessage('Data imported successfully!', 'success');
                } else {
                    this.uiManager.showMessage('Error importing data. Please check the file format.', 'error');
                }
            };
            reader.readAsText(file);
        }
    }

    clearAllData() {
        if (confirm('Are you absolutely sure you want to clear ALL data? This action cannot be undone.')) {
            if (confirm('This will delete all members, contributions, savings, and settings. Are you sure?')) {
                this.dataManager.clearAllData();
                this.loadMembers();
                this.loadContributions();
                this.loadSavings();
                this.updateDashboard();
                this.uiManager.showMessage('All data has been cleared!', 'success');
            }
        }
    }
}

// Initialize the application
const app = new FamilyManagementApp();

// Expose methods to global scope for HTML onclick handlers
window.app = {
    editMember: (id) => app.editMember(id),
    departMember: (id) => app.departMember(id),
    deleteContribution: (id) => app.deleteContribution(id),
    deleteSaving: (id) => app.deleteSaving(id),
    openContributionCellModal: (memberId, memberName, beneficiaryId, beneficiaryName) => 
        app.openContributionCellModal(memberId, memberName, beneficiaryId, beneficiaryName),
    openContributionModal: (memberId) => app.openContributionModal(memberId),
    deleteBeneficiary: (id) => app.deleteBeneficiary(id)
};