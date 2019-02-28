import * as React from 'react';
import {FoodGenre} from "../foodgenres";

interface Props {
    genre: FoodGenre;

    handleClickEat(): void;
}

export function FoodGenreDetail(props: Props) {
    const {genre, handleClickEat} = props;

    const renderSpicyLevels = () => {
        return [0, genre.spiceLevel].map(() => {
            return (
                <span>$</span>
            )
        })
    }

    return (
        <div className={'content'}>
            <p className="title is-4">{genre.name}</p>
            <p>{genre.description}</p>
            <p className="title is-5">Popular Dishes:</p>
            <ul>{genre.popularDishes.map(dish => <li key={dish}>{dish}</li>)}</ul>
            <p className={'title is-5'}>Spicy: {renderSpicyLevels()}</p>
            <div className="card-footer">
                <button className={'card-footer-item button'} onClick={handleClickEat}>Let's Eat!</button>
                <button className={'card-footer-item button'} onClick={() => console.log('i ate here')}>
                    I Ate Here!
                </button>
            </div>
        </div>
    )
}