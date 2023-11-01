import { ReactElement } from 'react';
import { styles } from 'styles/themes.css';

const hi = { hello: 'hi' };
const { hello } = hi;

type Props = {
  tag: string;
};

const Badge = ({ tag }: Props): ReactElement => {
  return <div className={styles.badge}>{tag}</div>;
};

export { hello }
export default Badge;
