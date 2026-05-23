// Feature: Bulk Delete
async function deleteSelectedWishes(idsArray) {
    const batch = db.batch();
    idsArray.forEach(id => {
        const ref = db.collection("wishes").doc(id);
        batch.delete(ref);
    });
    await batch.commit();
    showToast("Selected wishes deleted successfully!");
    renderWishes(allWishes);
}
