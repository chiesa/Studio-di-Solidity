import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
//import HeaderMoralis from '../components/HeaderMoralis'
import Header from '../components/Header'
import LotteryEntrance from '../components/LotteryEntrance'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Lottery</title>
        <meta name="description" content="Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      {/* header/navbar con un bottone che permette di connettersi al portafoglio identificando: portafoglio, rete e account 
          
          Prima opzione con Moralis
      <HeaderMoralis/>

          Seconda opzione con web3uikit
      */}
      <Header />
      <LotteryEntrance />
    </div>
  )
}
