import React from 'react'
import PropTypes from 'prop-types'

export const Panel: React.FC = props => {
    return (
        <div
            style={{
                margin: 10,
                background: '#fff',
                padding: '20px 0',
                height: '98%',
                overflowY: 'auto',
            }}
        >
            {props.children}
        </div>
    )
}

Panel.propTypes = {
    children: PropTypes.element.isRequired,
}
