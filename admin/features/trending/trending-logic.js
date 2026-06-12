import { getDatabase, ref, query, orderByChild, limitToLast, onValue } from "firebase/database";

// Iska kaam sirf trending data laana hai
export function fetchTrendingData(callback) {
    const db = getDatabase();
    const trendingQuery = query(
        ref(db, 'wishes'),
        orderByChild('likes'), // Likes ke basis par trending
        limitToLast(5)
    );

    onValue(trendingQuery, (snapshot) => {
        const data = snapshot.val();
        // Callback ke through data UI ko bhej denge
        callback(data ? Object.values(data).reverse() : []);
    });
}
