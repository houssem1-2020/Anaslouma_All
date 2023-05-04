import axios from 'axios';
import NG from '../../Notifications/notifGenre';
import GConf from '../../../AssetsM/generalConf';

const useSaveNotification = (genre,tag,table) => {
    axios.post(`${GConf.ApiLink}/notifications/ajouter`, {
        Tag : tag,
        genre : genre,
        text : NG[genre].GenFunction(table)
    }).then(function (response) {
        console.log('Ajouter')
    })
}
export default useSaveNotification ;