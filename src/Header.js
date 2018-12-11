import React from 'react'
import moment from 'moment'

const Header = ({lastCheck, lastError}) => {
    // console.log('aa: ',lastCheck, lastError )
    if (!lastCheck) {
        return (<div>Checking</div>)
    }

    const now = moment()
    const lastMoment = moment(lastCheck.timestamp)
    const lastMomentError = lastError ? moment(lastError.timestamp).format('YYYY-MM-DD HH:mm:ss') : 'N/A'

    return (
        <div>
            <p>Last check: <b>{ moment.duration(lastMoment.diff(now)).humanize(true)} at { lastMoment.format('HH:mm') } </b></p>
            <p>Last error:<b> { lastMomentError } </b> </p>
        </div>
    )

}

export default Header
