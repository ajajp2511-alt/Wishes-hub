export function addContributionToPool(wishItem, contributorEmail, amount) {
    wishItem.pooledFrom.push({ contributor: contributorEmail, amount });
    wishItem.amount += Number(amount);
}
