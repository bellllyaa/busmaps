import pythagoras from "./pythagoras";

function sortStopsByLocation(stopsList, userLocation) {

  stopsList.sort(function compareFn(stop1, stop2) {

    const compareResultNum = pythagoras(Math.abs(Number(stop1.location.lng) - userLocation.lng), Math.abs(Number(stop1.location.lat) - userLocation.lat)) - pythagoras(Math.abs(Number(stop2.location.lng) - userLocation.lng), Math.abs(Number(stop2.location.lat) - userLocation.lat));

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