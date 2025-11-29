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

        const departForm = document.getElementById('departForm');
        if (departForm) {
            departForm.addEventListener('submit', (e) => this.handleDepartForm(e));
        }

        const eulogyForm = document.getElementById('eulogyForm');
        if (eulogyForm) {
            eulogyForm.addEventListener('submit', (e) => this.handleEulogyForm(e));
        }

        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => this.handleFileImport(e));
        }

        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.clearAllData());
        }

        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportData());
        }

        const importDataBtn = document.getElementById('importDataBtn');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => this.importData());
        }

        // Profile picture upload
        const profilePicture = document.getElementById('profilePicture');
        if (profilePicture) {
            profilePicture.addEventListener('change', (e) => this.handleProfilePictureUpload(e));
        }

        // Eulogy profile picture upload
        const eulogyProfilePicture = document.getElementById('eulogyProfilePicture');
        if (eulogyProfilePicture) {
            eulogyProfilePicture.addEventListener('change', (e) => this.handleEulogyProfilePictureUpload(e));
        }

        // Print buttons
        const printMembersBtn = document.getElementById('printMembersBtn');
        if (printMembersBtn) {
            printMembersBtn.addEventListener('click', () => this.printTable('membersTable', 'Family Members'));
        }

        const printContributionsBtn = document.getElementById('printContributionsBtn');
        if (printContributionsBtn) {
            printContributionsBtn.addEventListener('click', () => this.printTable('contributionsTable', 'Contributions'));
        }

        const printSavingsBtn = document.getElementById('printSavingsBtn');
        if (printSavingsBtn) {
            printSavingsBtn.addEventListener('click', () => this.printTable('savingsTable', 'Savings'));
        }

        const printSeniorBtn = document.getElementById('printSeniorBtn');
        if (printSeniorBtn) {
            printSeniorBtn.addEventListener('click', () => this.printTable('seniorTable', 'Senior Members'));
        }

        const printDepartedBtn = document.getElementById('printDepartedBtn');
        if (printDepartedBtn) {
            printDepartedBtn.addEventListener('click', () => this.printTable('departedTable', 'Departed Members'));
        }

        const printPerformanceBtn = document.getElementById('printPerformanceBtn');
        if (printPerformanceBtn) {
            printPerformanceBtn.addEventListener('click', () => this.printPerformanceReport());
        }

        const printEulogyBtn = document.getElementById('printEulogyBtn');
        if (printEulogyBtn) {
            printEulogyBtn.addEventListener('click', () => this.printEulogy());
        }

        // Receipt button in contribution cell modal
        const receiptBtn = document.getElementById('receiptBtn');
        if (receiptBtn) {
            receiptBtn.addEventListener('click', () => this.generateReceipt());
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
        } else if (sectionName === 'performance') {
            this.loadPerformance();
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

        // Load beneficiary summary
        this.loadBeneficiarySummary();
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
            const avatar = member.profilePicture || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect fill='%23e2e8f0' width='40' height='40'/%3E%3C/svg%3E";
            return `
            <tr>
                <td><img src="${avatar}" alt="${member.name}" class="member-avatar"></td>
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
                        <button class="btn-secondary btn-sm" onclick="app.openDepartModal('${member.id}')">Depart</button>
                        <button class="btn-secondary btn-sm" onclick="app.openContributionModal('${member.id}')">Contribute</button>
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
        const tfoot = document.getElementById('contributionsTotals');

        // Build header with beneficiaries
        thead.innerHTML = `
            <tr>
                <th>Member ID</th>
                <th>Member Name</th>
                ${beneficiaries.map(b => `<th>${b.name}</th>`).join('')}
                <th>Actions</th>
            </tr>
        `;

        // Build table body and calculate totals
        const columnTotals = {};
        beneficiaries.forEach(b => columnTotals[b.id] = 0);

        tbody.innerHTML = members.map(member => {
            let rowHtml = `
                <td>${member.id}</td>
                <td>${member.name}</td>
            `;

            let rowTotal = 0;
            beneficiaries.forEach(beneficiary => {
                const contribution = this.dataManager.getContributionByMemberAndBeneficiary(member.id, beneficiary.id);
                const amount = contribution ? contribution.amount : 0;
                columnTotals[beneficiary.id] += amount;
                rowTotal += amount;
                rowHtml += `
                    <td class="contribution-cell" 
                        onclick="app.openContributionCellModal('${member.id}', '${member.name}', '${beneficiary.id}', '${beneficiary.name}')"
                        style="cursor: pointer; text-align: center;">
                        ${this.formatCurrency(amount)}
                    </td>
                `;
            });

            rowHtml += `<td style="text-align: center;">
                <button class="btn-secondary btn-sm" onclick="app.generateMemberContributionsReceipt('${member.id}', '${member.name}', ${rowTotal})">Receipt</button>
            </td>`;
            rowHtml = `<tr>${rowHtml}</tr>`;
            return rowHtml;
        }).join('');

        // Build footer with totals
        let footerHtml = `
            <tr>
                <td colspan="2" style="font-weight: 600; text-align: right;">Column Totals:</td>
                ${beneficiaries.map(b => `<td style="font-weight: 600; text-align: center;">${this.formatCurrency(columnTotals[b.id])}</td>`).join('')}
                <td style="font-weight: 600; text-align: center;">Total: ${this.formatCurrency(Object.values(columnTotals).reduce((a, b) => a + b, 0))}</td>
            </tr>
        `;
        tfoot.innerHTML = footerHtml;
    }

    loadSavings() {
        const savings = this.dataManager.getSavings();
        const tbody = document.getElementById('savingsTableBody');

        let totalAmount = 0;
        tbody.innerHTML = savings.map(saving => {
            totalAmount += saving.amount;
            return `
            <tr>
                <td>${saving.memberId}</td>
                <td>${saving.memberName}</td>
                <td>${this.formatCurrency(saving.amount)}</td>
                <td>${new Date(saving.date).toLocaleDateString()}</td>
                <td>
                    <button class="btn-secondary btn-sm" onclick="app.generateSavingsReceipt('${saving.id}', '${saving.memberId}', '${saving.memberName}', ${saving.amount}, '${saving.date}')">Receipt</button>
                    <button class="btn-secondary btn-sm" onclick="app.deleteSaving('${saving.id}')">Delete</button>
                </td>
            </tr>
        `;
        }).join('');

        // Update total
        document.getElementById('savingsTotalAmount').textContent = this.formatCurrency(totalAmount);
    }

    loadSeniorMembers() {
        const seniors = this.dataManager.getSeniorMembers();
        const tbody = document.getElementById('seniorTableBody');

        tbody.innerHTML = seniors.map(member => `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${this.dataManager.calculateAge(member.dateOfBirth)}</td>
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
                <td>
                    <button class="btn-secondary btn-sm" onclick="app.openEulogyModal('${member.id}')">Edit Eulogy</button>
                </td>
            </tr>
        `).join('');
    }

    loadPerformance() {
        const members = this.dataManager.getMembers();
        const contributions = this.dataManager.getContributions();
        const tbody = document.getElementById('performanceTableBody');

        tbody.innerHTML = members.map(member => {
            const memberContributions = contributions.filter(c => c.memberId === member.id).length;
            const achievement = this.getAchievementLevel(memberContributions);
            const nextThreshold = this.getNextThreshold(memberContributions);
            const progress = memberContributions % nextThreshold;

            return `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${memberContributions}</td>
                <td>${achievement}</td>
                <td>${progress}/${nextThreshold}</td>
            </tr>
            `;
        }).join('');
    }

    getAchievementLevel(contributionCount) {
        if (contributionCount >= 15) {
            return '⭐ Gold (' + contributionCount + ')';
        } else if (contributionCount >= 10) {
            return '⭐ Silver (' + contributionCount + ')';
        } else if (contributionCount >= 5) {
            return '⭐ Bronze (' + contributionCount + ')';
        } else {
            return 'Contributor (' + contributionCount + ')';
        }
    }

    getNextThreshold(contributionCount) {
        if (contributionCount < 5) return 5;
        if (contributionCount < 10) return 10;
        if (contributionCount < 15) return 15;
        return 15;
    }

    openMemberModal(memberId = null) {
        const modal = document.getElementById('memberModal');
        const form = document.getElementById('memberForm');
        window.currentProfilePicture = null;

        if (memberId) {
            const member = this.dataManager.getMember(memberId);
            document.getElementById('memberId').value = member.id;
            document.getElementById('memberName').value = member.name;
            document.getElementById('memberEmail').value = member.email;
            document.getElementById('memberPhone').value = member.phone;
            document.getElementById('memberDOB').value = member.dateOfBirth;
            document.getElementById('memberStatus').value = member.status;
            if (member.profilePicture) {
                document.getElementById('profilePreview').src = member.profilePicture;
                window.currentProfilePicture = member.profilePicture;
            }
        } else {
            form.reset();
            document.getElementById('memberId').value = '';
            document.getElementById('profilePreview').src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e2e8f0' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%2364748b' font-size='14'%3ENo Photo%3C/text%3E%3C/svg%3E";
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

        modal.style.display = 'block';
    }

    closeModal(modal) {
        modal.style.display = 'none';
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

    handleMemberForm(e) {
        e.preventDefault();

        const memberId = document.getElementById('memberId').value;
        const dob = document.getElementById('memberDOB').value;
        const age = this.dataManager.calculateAge(dob);
        let status = document.getElementById('memberStatus').value;

        // Auto-set as senior if 60+
        if (age >= 60) {
            status = 'senior';
        }

        const memberData = {
            id: memberId || this.generateMemberId(),
            name: document.getElementById('memberName').value,
            email: document.getElementById('memberEmail').value,
            phone: document.getElementById('memberPhone').value,
            dateOfBirth: dob,
            status: status,
            joinDate: memberId ? this.dataManager.getMember(memberId).joinDate : new Date().toISOString(),
            profilePicture: window.currentProfilePicture || null
        };

        this.dataManager.saveMember(memberData);
        window.currentProfilePicture = null;
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

    editMember(memberId) {
        this.openMemberModal(memberId);
    }

    departMember(memberId) {
        if (confirm('Are you sure you want to mark this member as departed?')) {
            this.dataManager.departMember(memberId, 'Departed', '');
            this.loadMembers();
            this.updateDashboard();
            this.uiManager.showMessage('Member departed successfully!', 'success');
        }
    }

    openDepartModal(memberId) {
        const modal = document.getElementById('departModal');
        const form = document.getElementById('departForm');
        document.getElementById('departMemberId').value = memberId;
        form.reset();
        modal.style.display = 'block';
    }

    handleDepartForm(e) {
        e.preventDefault();
        const memberId = document.getElementById('departMemberId').value;
        const reason = document.getElementById('departReason').value;
        const eulogy = document.getElementById('departEulogy').value;

        this.dataManager.departMember(memberId, reason, eulogy);
        this.loadMembers();
        this.updateDashboard();
        this.closeModal(document.getElementById('departModal'));
        this.uiManager.showMessage('Member marked as departed successfully!', 'success');
    }

    deleteContribution(contributionId) {
        if (confirm('Are you sure you want to delete this contribution?')) {
            this.dataManager.deleteContribution(contributionId);
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
            address: document.getElementById('address').value || '',
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

    handleProfilePictureUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                document.getElementById('profilePreview').src = base64;
                window.currentProfilePicture = base64;
            };
            reader.readAsDataURL(file);
        }
    }

    openEulogyModal(memberId) {
        const modal = document.getElementById('eulogyModal');
        const member = this.dataManager.getDepartedMembers().find(m => m.id === memberId);

        if (member) {
            document.getElementById('eulogyMemberId').value = memberId;
            document.getElementById('eulogyIntroduction').value = member.eulogyIntroduction || '';
            document.getElementById('eulogyBiography').value = member.eulogyBiography || '';
            document.getElementById('eulogyAnecdotes').value = member.eulogyAnecdotes || '';
            document.getElementById('eulogyLegacy').value = member.eulogyLegacy || '';
            document.getElementById('eulogyClosing').value = member.eulogyClosing || '';
            if (member.eulogyPhoto) {
                document.getElementById('eulogyProfilePreview').src = member.eulogyPhoto;
            } else {
                document.getElementById('eulogyProfilePreview').src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect fill='%23e2e8f0' width='120' height='120'/%3E%3Ctext x='60' y='60' text-anchor='middle' dy='.3em' fill='%2364748b' font-size='14'%3EMemorial Photo%3C/text%3E%3C/svg%3E";
            }
            window.currentEulogyPhoto = member.eulogyPhoto || null;
            modal.style.display = 'block';
        }
    }

    handleEulogyForm(e) {
        e.preventDefault();
        const memberId = document.getElementById('eulogyMemberId').value;
        const introduction = document.getElementById('eulogyIntroduction').value;
        const biography = document.getElementById('eulogyBiography').value;
        const anecdotes = document.getElementById('eulogyAnecdotes').value;
        const legacy = document.getElementById('eulogyLegacy').value;
        const closing = document.getElementById('eulogyClosing').value;

        // Update the departed member with new eulogy and photo
        const departedMembers = this.dataManager.getDepartedMembers();
        const memberIndex = departedMembers.findIndex(m => m.id === memberId);

        if (memberIndex >= 0) {
            departedMembers[memberIndex].eulogyIntroduction = introduction;
            departedMembers[memberIndex].eulogyBiography = biography;
            departedMembers[memberIndex].eulogyAnecdotes = anecdotes;
            departedMembers[memberIndex].eulogyLegacy = legacy;
            departedMembers[memberIndex].eulogyClosing = closing;
            if (window.currentEulogyPhoto) {
                departedMembers[memberIndex].eulogyPhoto = window.currentEulogyPhoto;
            }
            this.dataManager.saveToStorage('departedMembers', departedMembers);
            this.loadDepartedMembers();
            this.closeModal(document.getElementById('eulogyModal'));
            this.uiManager.showMessage('Eulogy updated successfully!', 'success');
        }
        window.currentEulogyPhoto = null;
    }

    handleEulogyProfilePictureUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                document.getElementById('eulogyProfilePreview').src = base64;
                window.currentEulogyPhoto = base64;
            };
            reader.readAsDataURL(file);
        }
    }

    loadBeneficiarySummary() {
        const beneficiaries = this.dataManager.getBeneficiaries();
        const contributions = this.dataManager.getContributions();
        const tbody = document.getElementById('dashboardBeneficiaryBody');

        if (!tbody) return;

        let grandTotal = 0;
        tbody.innerHTML = beneficiaries.map(beneficiary => {
            const beneficiaryContributions = contributions.filter(c => c.beneficiaryId === beneficiary.id);
            const totalAmount = beneficiaryContributions.reduce((sum, c) => sum + c.amount, 0);
            const contributors = new Set(beneficiaryContributions.map(c => c.memberId)).size;
            const average = contributors > 0 ? totalAmount / contributors : 0;
            grandTotal += totalAmount;

            return `
            <tr>
                <td>${beneficiary.id}</td>
                <td>${beneficiary.name}</td>
                <td>${beneficiary.category}</td>
                <td>${this.formatCurrency(totalAmount)}</td>
                <td>${contributors}</td>
                <td>${this.formatCurrency(average)}</td>
            </tr>
        `;
        }).join('');

        // Add total row if there are beneficiaries
        if (beneficiaries.length > 0) {
            const tableBody = document.querySelector('#dashboardBeneficiaryTable tbody');
            const totalRow = `
            <tr style="background-color: #f0f9ff; font-weight: 600; border-top: 2px solid #2563eb;">
                <td colspan="3" style="text-align: right;">Grand Total:</td>
                <td>${this.formatCurrency(grandTotal)}</td>
                <td colspan="2"></td>
            </tr>
            `;
            if (tableBody) {
                tableBody.innerHTML += totalRow;
            }
        }
    }

    printTable(tableId, title) {
        const table = document.getElementById(tableId);
        const settings = this.dataManager.getSettings();
        const familyName = settings.familyName || 'Family Records';
        const address = settings.address || '';

        const printWindow = window.open('', '', 'height=600,width=1000');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body {
                        font-family: 'Inter', Arial, sans-serif;
                        margin: 2rem;
                        color: #1e293b;
                    }
                    .print-header {
                        text-align: center;
                        margin-bottom: 1.5rem;
                        border-bottom: 2px solid #2563eb;
                        padding-bottom: 1rem;
                    }
                    .print-header h1 {
                        color: #2563eb;
                        margin: 0 0 0.5rem 0;
                        font-size: 1.75rem;
                    }
                    .print-header p {
                        color: #64748b;
                        margin: 0.25rem 0;
                        font-size: 0.95rem;
                    }
                    h2 {
                        text-align: center;
                        color: #2563eb;
                        margin-bottom: 1rem;
                        font-size: 1.5rem;
                    }
                    .print-date {
                        text-align: center;
                        color: #64748b;
                        margin-bottom: 1.5rem;
                        font-size: 0.9rem;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 1rem;
                    }
                    th {
                        background-color: #2563eb;
                        color: white;
                        padding: 0.75rem;
                        text-align: left;
                        font-weight: 600;
                        border: 1px solid #1d4ed8;
                    }
                    td {
                        padding: 0.75rem;
                        border: 1px solid #e2e8f0;
                    }
                    tbody tr:nth-child(odd) {
                        background-color: #f9fafb;
                    }
                    tbody tr:nth-child(even) {
                        background-color: #ffffff;
                    }
                    img.member-avatar {
                        width: 40px !important;
                        height: 40px !important;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 2px solid #ddd;
                        display: block;
                    }
                    tfoot {
                        background-color: #f0f9ff;
                        font-weight: 600;
                    }
                    tfoot tr {
                        border-top: 2px solid #2563eb;
                    }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h1>${familyName}</h1>
                    ${address ? `<p>${address}</p>` : ''}
                </div>
                <h2>${title}</h2>
                <div class="print-date">Printed on: ${new Date().toLocaleString()}</div>
                ${table.outerHTML}
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
    }

    printEulogy() {
        const memberId = document.getElementById('eulogyMemberId').value;
        const departed = this.dataManager.getDepartedMembers().find(m => m.id === memberId);
        const introduction = document.getElementById('eulogyIntroduction').value;
        const biography = document.getElementById('eulogyBiography').value;
        const anecdotes = document.getElementById('eulogyAnecdotes').value;
        const legacy = document.getElementById('eulogyLegacy').value;
        const closing = document.getElementById('eulogyClosing').value;
        const photo = document.getElementById('eulogyProfilePreview').src;

        if (!introduction.trim() || !biography.trim() || !anecdotes.trim()) {
            this.uiManager.showMessage('Please fill all required sections before printing.', 'error');
            return;
        }

        const printWindow = window.open('', '', 'height=600,width=900');
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Tribute - ${departed.name}</title>
                <style>
                    body {
                        font-family: 'Georgia', serif;
                        margin: 0;
                        padding: 2.5rem;
                        color: #1e293b;
                        background: white;
                        line-height: 1.8;
                    }
                    .memorial-header {
                        text-align: center;
                        margin-bottom: 2rem;
                        border-bottom: 3px solid #2563eb;
                        padding-bottom: 1.5rem;
                    }
                    .memorial-photo {
                        width: 150px;
                        height: 150px;
                        border-radius: 10px;
                        border: 4px solid #2563eb;
                        margin: 0 auto 1rem;
                        object-fit: cover;
                        display: block;
                    }
                    .memorial-title {
                        font-size: 2rem;
                        color: #2563eb;
                        margin: 0;
                    }
                    .memorial-dates {
                        color: #64748b;
                        font-size: 0.95rem;
                    }
                    .section {
                        margin-bottom: 2rem;
                    }
                    .section-title {
                        font-size: 1.25rem;
                        color: #2563eb;
                        margin-bottom: 0.75rem;
                        border-left: 4px solid #2563eb;
                        padding-left: 1rem;
                    }
                    .section-content {
                        text-align: justify;
                    }
                    .print-footer {
                        margin-top: 2rem;
                        padding-top: 1rem;
                        border-top: 2px solid #e2e8f0;
                        text-align: center;
                        color: #64748b;
                        font-size: 0.9rem;
                    }
                </style>
            </head>
            <body>
                <div class="memorial-header">
                    ${photo && !photo.includes('svg') ? `<img src="${photo}" class="memorial-photo" alt="${departed.name}">` : ''}
                    <h1 class="memorial-title">${departed.name}</h1>
                    <p class="memorial-dates">${new Date(departed.joinDate).toLocaleDateString()} - ${new Date(departed.departureDate).toLocaleDateString()}</p>
                </div>

                <div class="section">
                    <h2 class="section-title">The Introduction</h2>
                    <div class="section-content">${introduction.replace(/\n/g, '<br>')}</div>
                </div>

                <div class="section">
                    <h2 class="section-title">The Biography</h2>
                    <div class="section-content">${biography.replace(/\n/g, '<br>')}</div>
                </div>

                <div class="section">
                    <h2 class="section-title">Personal Anecdotes & Character</h2>
                    <div class="section-content">${anecdotes.replace(/\n/g, '<br>')}</div>
                </div>

                ${legacy.trim() ? `<div class="section">
                    <h2 class="section-title">Legacy & Impact</h2>
                    <div class="section-content">${legacy.replace(/\n/g, '<br>')}</div>
                </div>` : ''}

                ${closing.trim() ? `<div class="section">
                    <h2 class="section-title">Closing Remarks</h2>
                    <div class="section-content">${closing.replace(/\n/g, '<br>')}</div>
                </div>` : ''}

                <div class="print-footer">
                    <p>Tribute printed on ${new Date().toLocaleString()}</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
    }

    printPerformanceReport() {
        const members = this.dataManager.getMembers();
        const contributions = this.dataManager.getContributions();
        const settings = this.dataManager.getSettings();
        const familyName = settings.familyName || 'Family Records';

        const data = members.map(member => {
            const memberContributions = contributions.filter(c => c.memberId === member.id).length;
            const achievement = this.getAchievementLevel(memberContributions);
            return { name: member.name, contributions: memberContributions, achievement };
        });

        const printWindow = window.open('', '', 'height=600,width=1000');
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Performance Report</title>
                <style>
                    body { font-family: 'Inter', Arial; margin: 2rem; color: #1e293b; }
                    .header { text-align: center; margin-bottom: 2rem; }
                    .header h1 { color: #2563eb; margin: 0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                    th { background-color: #2563eb; color: white; padding: 0.75rem; text-align: left; }
                    td { padding: 0.75rem; border: 1px solid #e2e8f0; }
                    tbody tr:nth-child(odd) { background-color: #f9fafb; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${familyName}</h1>
                    <h2>Member Performance Report</h2>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Member Name</th>
                            <th>Total Contributions</th>
                            <th>Achievement Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(d => `<tr><td>${d.name}</td><td>${d.contributions}</td><td>${d.achievement}</td></tr>`).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
    }

    generateReceipt() {
        const memberId = document.getElementById('cellMemberId').value;
        const beneficiaryId = document.getElementById('cellBeneficiary').value;
        const amount = document.getElementById('cellContributionAmount').value;
        const memberName = document.getElementById('cellMemberName').value;
        const beneficiaryName = document.getElementById('cellBeneficiaryName').value;
        const settings = this.dataManager.getSettings();
        const familyName = settings.familyName || 'Family Records';
        const address = settings.address || '';

        const receiptNumber = `RCP-${Date.now()}`;
        const receiptDate = new Date();

        const printWindow = window.open('', '', 'height=600,width=800');
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt - ${receiptNumber}</title>
                <style>
                    body { font-family: 'Courier New', monospace; margin: 0; padding: 2rem; background: white; }
                    .receipt-container { max-width: 400px; margin: 0 auto; border: 2px solid #2563eb; padding: 1.5rem; }
                    .header { text-align: center; margin-bottom: 1.5rem; border-bottom: 2px solid #2563eb; padding-bottom: 1rem; }
                    .header h1 { margin: 0; font-size: 1.5rem; color: #2563eb; }
                    .header p { margin: 0.25rem 0; color: #64748b; font-size: 0.9rem; }
                    .section { margin-bottom: 1rem; }
                    .section-title { font-weight: bold; color: #2563eb; margin-bottom: 0.5rem; border-bottom: 1px dashed #e2e8f0; }
                    .row { display: flex; justify-content: space-between; margin: 0.25rem 0; }
                    .label { font-weight: bold; }
                    .footer { text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0; font-size: 0.85rem; color: #64748b; }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <div class="header">
                        <h1>${familyName}</h1>
                        ${address ? `<p>${address}</p>` : ''}
                        <p>CONTRIBUTION RECEIPT</p>
                    </div>

                    <div class="section">
                        <div class="section-title">Receipt Details</div>
                        <div class="row">
                            <span class="label">Receipt #:</span>
                            <span>${receiptNumber}</span>
                        </div>
                        <div class="row">
                            <span class="label">Date:</span>
                            <span>${receiptDate.toLocaleDateString()}</span>
                        </div>
                        <div class="row">
                            <span class="label">Time:</span>
                            <span>${receiptDate.toLocaleTimeString()}</span>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Member Information</div>
                        <div class="row">
                            <span class="label">Member ID:</span>
                            <span>${memberId}</span>
                        </div>
                        <div class="row">
                            <span class="label">Member Name:</span>
                            <span>${memberName}</span>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Contribution Details</div>
                        <div class="row">
                            <span class="label">Beneficiary:</span>
                            <span>${beneficiaryName}</span>
                        </div>
                        <div class="row">
                            <span class="label">Amount:</span>
                            <span>${this.formatCurrency(parseFloat(amount))}</span>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for your contribution!</p>
                        <p>This receipt is valid proof of contribution.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
    }

    generateMemberContributionsReceipt(memberId, memberName, totalAmount) {
        const settings = this.dataManager.getSettings();
        const familyName = settings.familyName || 'Family Records';
        const address = settings.address || '';
        const member = this.dataManager.getMember(memberId);
        const beneficiaries = this.dataManager.getBeneficiaries();
        const receiptNumber = `MEM-RCP-${Date.now()}`;
        const receiptDate = new Date();

        let beneficiaryList = '';
        beneficiaries.forEach(beneficiary => {
            const contribution = this.dataManager.getContributionByMemberAndBeneficiary(memberId, beneficiary.id);
            if (contribution) {
                beneficiaryList += `<div class="row">
                    <span>${beneficiary.name}</span>
                    <span>${this.formatCurrency(contribution.amount)}</span>
                </div>`;
            }
        });

        const printWindow = window.open('', '', 'height=600,width=800');
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Member Receipt - ${receiptNumber}</title>
                <style>
                    body { font-family: 'Courier New', monospace; margin: 0; padding: 2rem; background: white; }
                    .receipt-container { max-width: 400px; margin: 0 auto; border: 2px solid #2563eb; padding: 1.5rem; }
                    .header { text-align: center; margin-bottom: 1.5rem; border-bottom: 2px solid #2563eb; padding-bottom: 1rem; }
                    .header h1 { margin: 0; font-size: 1.5rem; color: #2563eb; }
                    .header p { margin: 0.25rem 0; color: #64748b; font-size: 0.9rem; }
                    .section { margin-bottom: 1rem; }
                    .section-title { font-weight: bold; color: #2563eb; margin-bottom: 0.5rem; border-bottom: 1px dashed #e2e8f0; }
                    .row { display: flex; justify-content: space-between; margin: 0.25rem 0; }
                    .label { font-weight: bold; }
                    .total-row { border-top: 1px dashed #e2e8f0; padding-top: 0.5rem; margin-top: 0.5rem; font-weight: bold; }
                    .footer { text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0; font-size: 0.85rem; color: #64748b; }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <div class="header">
                        <h1>${familyName}</h1>
                        ${address ? `<p>${address}</p>` : ''}
                        <p>MEMBER CONTRIBUTION SUMMARY</p>
                    </div>

                    <div class="section">
                        <div class="section-title">Receipt Details</div>
                        <div class="row">
                            <span class="label">Receipt #:</span>
                            <span>${receiptNumber}</span>
                        </div>
                        <div class="row">
                            <span class="label">Date:</span>
                            <span>${receiptDate.toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Member Information</div>
                        <div class="row">
                            <span class="label">ID:</span>
                            <span>${memberId}</span>
                        </div>
                        <div class="row">
                            <span class="label">Name:</span>
                            <span>${memberName}</span>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Contributions by Beneficiary</div>
                        ${beneficiaryList}
                        <div class="row total-row">
                            <span>TOTAL:</span>
                            <span>${this.formatCurrency(totalAmount)}</span>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for your generous contributions!</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
    }

    generateSavingsReceipt(savingId, memberId, memberName, amount, date) {
        const settings = this.dataManager.getSettings();
        const familyName = settings.familyName || 'Family Records';
        const address = settings.address || '';
        const receiptNumber = `SAV-RCP-${Date.now()}`;
        const receiptDate = new Date();

        const printWindow = window.open('', '', 'height=600,width=800');
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Savings Receipt - ${receiptNumber}</title>
                <style>
                    body { font-family: 'Courier New', monospace; margin: 0; padding: 2rem; background: white; }
                    .receipt-container { max-width: 400px; margin: 0 auto; border: 2px solid #10b981; padding: 1.5rem; }
                    .header { text-align: center; margin-bottom: 1.5rem; border-bottom: 2px solid #10b981; padding-bottom: 1rem; }
                    .header h1 { margin: 0; font-size: 1.5rem; color: #10b981; }
                    .header p { margin: 0.25rem 0; color: #64748b; font-size: 0.9rem; }
                    .section { margin-bottom: 1rem; }
                    .section-title { font-weight: bold; color: #10b981; margin-bottom: 0.5rem; border-bottom: 1px dashed #e2e8f0; }
                    .row { display: flex; justify-content: space-between; margin: 0.25rem 0; }
                    .label { font-weight: bold; }
                    .footer { text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0; font-size: 0.85rem; color: #64748b; }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <div class="header">
                        <h1>${familyName}</h1>
                        ${address ? `<p>${address}</p>` : ''}
                        <p>SAVINGS RECEIPT</p>
                    </div>

                    <div class="section">
                        <div class="section-title">Receipt Details</div>
                        <div class="row">
                            <span class="label">Receipt #:</span>
                            <span>${receiptNumber}</span>
                        </div>
                        <div class="row">
                            <span class="label">Date:</span>
                            <span>${receiptDate.toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Member Information</div>
                        <div class="row">
                            <span class="label">ID:</span>
                            <span>${memberId}</span>
                        </div>
                        <div class="row">
                            <span class="label">Name:</span>
                            <span>${memberName}</span>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Saving Details</div>
                        <div class="row">
                            <span class="label">Amount:</span>
                            <span>${this.formatCurrency(amount)}</span>
                        </div>
                        <div class="row">
                            <span class="label">Saving Date:</span>
                            <span>${new Date(date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for saving with us!</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
    }

    deleteBeneficiary(beneficiaryId) {
        if (confirm('Are you sure you want to delete this beneficiary? All associated contributions will be lost.')) {
            this.dataManager.deleteBeneficiary(beneficiaryId);
            this.loadContributions();
            this.updateDashboard();
            this.uiManager.showMessage('Beneficiary deleted successfully!', 'success');
        }
    }

    getAchievementLevel(contributionCount) {
        if (contributionCount >= 15) {
            return '⭐ Gold (' + contributionCount + ')';
        } else if (contributionCount >= 10) {
            return '⭐ Silver (' + contributionCount + ')';
        } else if (contributionCount >= 5) {
            return '⭐ Bronze (' + contributionCount + ')';
        } else {
            return 'Contributor (' + contributionCount + ')';
        }
    }

    getNextThreshold(contributionCount) {
        if (contributionCount < 5) return 5;
        if (contributionCount < 10) return 10;
        if (contributionCount < 15) return 15;
        return 15;
    }
}

// Initialize the application
const app = new FamilyManagementApp();

// Expose methods to global scope for HTML onclick handlers
window.app = {
    editMember: (id) => app.editMember(id),
    openDepartModal: (id) => app.openDepartModal(id),
    openContributionModal: (memberId) => app.openContributionModal(memberId),
    openContributionCellModal: (memberId, memberName, beneficiaryId, beneficiaryName) => 
        app.openContributionCellModal(memberId, memberName, beneficiaryId, beneficiaryName),
    deleteContribution: (id) => app.deleteContribution(id),
    deleteSaving: (id) => app.deleteSaving(id),
    deleteBeneficiary: (id) => app.deleteBeneficiary(id),
    generateReceipt: () => app.generateReceipt(),
    generateMemberContributionsReceipt: (memberId, memberName, totalAmount) => 
        app.generateMemberContributionsReceipt(memberId, memberName, totalAmount),
    generateSavingsReceipt: (savingId, memberId, memberName, amount, date) =>
        app.generateSavingsReceipt(savingId, memberId, memberName, amount, date),
    openEulogyModal: (id) => app.openEulogyModal(id)
};

