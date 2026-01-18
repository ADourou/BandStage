const { getConnection } = require('./database');

// GET review
async function getReviews(bandName, ratingFrom, ratingTo) {
    const conn = await getConnection();
    
    // search for published
    let sql = "SELECT * FROM reviews WHERE status = 'published'";
    let params = [];

    if (bandName !== 'all') {
        sql += " AND band_name = ?";
        params.push(bandName);
    }

    if (ratingFrom) {
        sql += " AND rating >= ?";
        params.push(ratingFrom);
    }
    if (ratingTo) {
        sql += " AND rating <= ?";
        params.push(ratingTo);
    }

    const [rows] = await conn.execute(sql, params);
    return rows;
}

// PUT
async function updateReviewStatus(reviewId, newStatus) {
    const conn = await getConnection();
    const sql = "UPDATE reviews SET status = ? WHERE review_id = ?";
    
    
    const [result] = await conn.execute(sql, [newStatus, reviewId]);
    return result;
}

//DELETE
async function deleteReview(reviewId) {
    const conn = await getConnection();
    const sql = "DELETE FROM reviews WHERE review_id = ?";
    
    const [result] = await conn.execute(sql, [reviewId]);
    return result;
}


async function checkBand(bandName) {
    const conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM bands WHERE band_name = ?", [bandName]);
    return rows.length > 0;
}

module.exports = { getReviews, updateReviewStatus, deleteReview, checkBand };