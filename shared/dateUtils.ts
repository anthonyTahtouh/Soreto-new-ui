import moment from 'moment';

const formatDate = (date: string) => {
    return moment(date).format('DD-MM-yyyy');
}

export {
    formatDate
}