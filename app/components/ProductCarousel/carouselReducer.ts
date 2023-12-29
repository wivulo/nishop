import { iCarouselReducerAction } from "@/app/models/iCarouselReducerAction"

export function carouselReducer(scrollLeft: any, action: iCarouselReducerAction){
    switch(action.type){
        case "type/increase": {
            if(scrollLeft < 0 ) scrollLeft = 0;

            return scrollLeft + action.payload.scroll
        }
        case "type/decrease": {
            if(scrollLeft > 0 ) scrollLeft = -1;
            
            return  scrollLeft - action.payload.scroll
        }
        default: { return 0 }
    }
}