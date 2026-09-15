export function spinAndWinReward() {
    const rewards = [10, 25, 50, 100, 200];
    const won = rewards[Math.floor(Math.random() * rewards.length)];
    return won;
}
