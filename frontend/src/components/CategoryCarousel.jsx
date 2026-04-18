import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='max-w-xl mx-auto my-16 px-4'>
            <Carousel className="w-full">
                <CarouselContent>
                    {
                        category.map((cat, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <Button 
                                    onClick={() => searchJobHandler(cat)} 
                                    variant="outline" 
                                    className="rounded-full border-border text-muted-foreground hover:text-neon-purple hover:border-neon-purple/30 hover:bg-neon-purple/5 transition-all text-xs"
                                >
                                    {cat}
                                </Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious className="border-border text-muted-foreground hover:text-foreground hover:bg-accent" />
                <CarouselNext className="border-border text-muted-foreground hover:text-foreground hover:bg-accent" />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel