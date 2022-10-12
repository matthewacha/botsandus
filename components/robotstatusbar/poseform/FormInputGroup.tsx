import { KeyboardEvent, RefObject } from 'react';

import styles from './styles.module.css';

type FormInputGroupProps = {
  label: string;
  inputRef: RefObject<HTMLInputElement>;
  name: string;
  placeholder?: string;
  className?: string;
  type: 'number' | 'test' | 'button' | 'date'; // add any types that apply
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
};

/**
 * Input field group
 * @param FormInputGroupProps expected props
 * @returns jsx
 */
const FormInputGroup = ({ className, inputRef, label, name, type, placeholder='', onKeyDown }: FormInputGroupProps) => {
  return (<>
    <div className={ styles.forminputgroup }>
      <label htmlFor={ name } className={ styles.label }>{label}</label>
      <input
        ref={ inputRef }
        className={ className }
        type={ type }
        onKeyDown={ onKeyDown }
        name={ name }
        placeholder={ placeholder }
        defaultValue={ 0.00 }
      />
    </div>
  </>);
};

export default FormInputGroup;