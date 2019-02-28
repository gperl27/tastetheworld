import * as React from 'react';

interface Props {
    children: React.ReactNode;
    closable?: boolean;

    onClose?(): void;
}

export const Card = (props: Props) => {
    return (
        <div style={{maxWidth: '400px'}} className={'card notification'}>
            {
                props.closable &&
                <button onClick={props.onClose ? props.onClose : undefined} className={'delete'}/>
            }
            {props.children}
        </div>
    )
}