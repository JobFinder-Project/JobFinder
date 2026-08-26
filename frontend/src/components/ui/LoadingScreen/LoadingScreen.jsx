import { OrbitProgress } from 'react-loading-indicators';

export default function LoadingScreen() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%',
            backgroundColor: '#fff',
            zIndex: 9999
        }}>
            {/* <Mosaic text={text} color={['#f5e902', '#fef32c', '#fef65f', '#fef992']} /> */}
            <OrbitProgress variant='track-disc' speedPlus='0' easing='linear' color='#000000' />
        </div>
    );
}
