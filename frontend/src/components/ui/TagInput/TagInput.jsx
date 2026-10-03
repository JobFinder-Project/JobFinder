import { useState, useRef } from 'react';
import { BiX } from 'react-icons/bi';
import styles from './TagInput.module.css';

/**
 * Componente de entrada de tags para campos como habilidades, idiomas e cursos.
 * Armazena e entrega o valor como string separada por vírgula (compatível com o backend).
 *
 * @param {string} value - Valor atual em formato "Tag1, Tag2, Tag3"
 * @param {function} onChange - Callback chamado com o novo valor string ao adicionar/remover tag
 * @param {string} placeholder - Placeholder exibido no input interno
 * @param {string} id - ID do campo (para associar ao label externo)
 */
export default function TagInput({ value = '', onChange, placeholder = 'Digite e pressione Enter', id }) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    const tags = value
        ? value.split(',').map(t => t.trim()).filter(t => t !== '')
        : [];

    const addTag = (raw) => {
        const tag = raw.trim();
        if (!tag || tags.includes(tag)) return;
        const newTags = [...tags, tag];
        onChange(newTags.join(', '));
        setInputValue('');
    };

    const removeTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        onChange(newTags.join(', '));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const handleBlur = () => {
        if (inputValue.trim()) addTag(inputValue);
    };

    return (
        <div
            className={styles.container}
            onClick={() => inputRef.current?.focus()}
        >
            {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                    {tag}
                    <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={(e) => { e.stopPropagation(); removeTag(index); }}
                        aria-label={`Remover ${tag}`}
                    >
                        <BiX size={14} />
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                id={id}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={tags.length === 0 ? placeholder : ''}
                className={styles.input}
                aria-label={placeholder}
            />
        </div>
    );
}
