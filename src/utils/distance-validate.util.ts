function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export const distanceValidate = (center: string, point: string): boolean => {
  const earthRadiusKm = 6371;

  const [lat1, lon1] = center.split(',').map(Number);
  const [lat2, lon2] = point.split(',').map(Number);

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusKm * c * 1000;

  return distance <= 200;
};
