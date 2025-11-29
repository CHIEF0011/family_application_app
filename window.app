window.app = {
    editMember: (id) => app.editMember(id),
    departMember: (id) => app.departMember(id),
    deleteContribution: (id) => app.deleteContribution(id),
    deleteSaving: (id) => app.deleteSaving(id),
    openContributionCellModal: (memberId, memberName, beneficiaryId, beneficiaryName) => 
        app.openContributionCellModal(memberId, memberName, beneficiaryId, beneficiaryName),
    openContributionModal: (memberId) => app.openContributionModal(memberId),
    quickContribute: (memberId, memberName) => app.quickContribute(memberId, memberName),
    deleteBeneficiary: (id) => app.deleteBeneficiary(id),
    openEulogyModal: (id) => app.openEulogyModal(id),
    openDepartModal: (id) => app.openDepartModal(id)
};

