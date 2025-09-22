import { Pipe, PipeTransform } from '@angular/core';
import { Rating } from './rating';

@Pipe({
  name: 'ratingSort'
})
export class RatingSortPipe implements PipeTransform {

  transform(ratings: Rating[] | undefined, sortBy: string, sortOptions: string[]): any {
    if (ratings == undefined) {
      return null;
    }

    let sortedRatings: Rating[] = ratings;

    switch (sortBy) {
      case sortOptions[1]: { //date old-new
        sortedRatings = sortedRatings.sort((a, b) => {
          if (a.date == undefined || b.date == undefined) {
            return 0;
          }

          return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        break;
      }
      case sortOptions[2]: { //Rating High-Low
        sortedRatings = sortedRatings.sort((a, b) => b.value - a.value)
        break;
      }
      case sortOptions[3]: { //Rating Low-High
        sortedRatings = sortedRatings.sort((a, b) => a.value - b.value)
        break;
      }
      case sortOptions[0]: //date new-old
      default: {
        sortedRatings = sortedRatings.sort((a, b) => {
          if (a.date == undefined || b.date == undefined) {
            return 0;
          }

          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        break;
      }
    }

    return sortedRatings;
  }

}
