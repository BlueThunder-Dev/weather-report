import './App.css'
import SearchInput from './components/search-input/SearchInput'
import { MinLength } from './utils/validators/MinLength';
import { Pattern } from './utils/validators/Pattern';
import { Required} from './utils/validators/Required';

function App() {
 const inputValidators = [
    new Required('Input cannot be empty'),
    new MinLength(3,'Min. 2 characters required'),
    new Pattern( /^[\p{L}\s-]+$/u, 'Invalid characters')
  ];

  return (
    <>
     <SearchInput
     label="Country"
     placeholder="Insert a country"
     validators={inputValidators}
    />
    </>
  )
}

export default App
