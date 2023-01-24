function pythagoras(sideA, sideB){
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}

function sortStopsByLocation(stopsList, userLocation) {
  stopsList.sort(function compareFn(stop1, stop2) {

    const compareResultNum = pythagoras(Math.abs(Number(stop1.stopLon) - userLocation.lon), Math.abs(Number(stop1.stopLat) - userLocation.lat)) - pythagoras(Math.abs(Number(stop2.stopLon) - userLocation.lon), Math.abs(Number(stop2.stopLat) - userLocation.lat));

    if (compareResultNum < 0) {
      return -1
    } else if (compareResultNum > 0) {
      return 1
    } else {
      return 0;
    }
  })

  return stopsList;
}

export default sortStopsByLocation;