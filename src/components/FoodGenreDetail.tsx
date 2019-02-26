import * as React from 'react';
import {FoodGenre} from "../foodgenres";

interface Props {
    genre: FoodGenre;

    handleClickEat(): void;
}

export function FoodGenreDetail(props: Props) {
    const {genre, handleClickEat} = props;

    return (
        <>
            <div>{genre.name}</div>
            <div>{genre.description}</div>
            <div>Spicy: {genre.spiceLevel}</div>
            <div>{genre.popularDishes.map(dish => <div key={dish}>{dish}</div>)}</div>
            <button className={'button'} onClick={handleClickEat}>Let's Eat!</button>
        </>
    )
}