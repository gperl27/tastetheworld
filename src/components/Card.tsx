import * as React from 'react';

interface Props {
    children: React.ReactNode;
    closable?: boolean;

    onClose?(): void;
}

export const Card = (props: Props) => {
    return (
        <div className={'card'}>
            <div className={'card-header'}>
                {
                    props.closable &&
                    <button onClick={props.onClose ? props.onClose : undefined} className={'delete'}/>
                }
            </div>
            <div className="card-content">
                {props.children}
            </div>
        </div>
    )
}