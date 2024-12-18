const haversineDistance = (lat1, lon1, lat2, lon2) => {
    console.log(lat1,lon1,lat2,lon2)
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    console.log(dLat,dLon,"dLat ,dLong")
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
            console.log(a,"a");
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
     console.log(c,"c")
    const distance = R * c; // Distance in kilometers
    console.log(distance,"distance")
    return distance * 1000; // Convert to meters
};

module.exports = { haversineDistance };
