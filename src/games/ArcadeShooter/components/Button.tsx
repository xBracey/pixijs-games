import BaseButton, { IButton } from '@dom/Button';
import { twMerge } from 'tailwind-merge';

export const Button = (props: IButton) => <BaseButton {...props} className={twMerge('border-arcade-300', props.className)} />;
