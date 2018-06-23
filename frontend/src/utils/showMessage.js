import { store } from '../redux/store';
import { toast } from 'react-toastify';

export const showMessage = () => {
  const currStore = store.getState();
  const message = currStore.messageReducer.message;
  const messageType = currStore.messageReducer.messageType;
  return toast[messageType](message);
}
