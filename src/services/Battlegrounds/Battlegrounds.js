import axios from 'axios';
import { OMNO_API } from '../../data/CONSTANTS';

export const getArenas = async () => {
    return axios.get(`${OMNO_API}/index.php?action=getOmnoGameState`)
    .then((res) => res.data.state.arena)
    .catch((error) => error)
}