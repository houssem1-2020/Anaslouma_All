import React from 'react';

function TableImage(props) {
     
    return (<span className='notification'> 
    			<img className='rounded-circle ' 
                    width="40px" 
                    height="40px" 
                    src={props.forStock ? `https://assets.ansl.tn/Images/Articles/${props.image}` : `https://system.anaslouma.tn/Assets/images/${props.image}`} alt="user-img" 
                /> 
                <span className={`${props.fixed ? ' badged ' : 'd-none'}`}></span>
            </span>);
}

export default TableImage