import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'

import checklistIcon from '../../assets/icon/checklist.png'
import backIcon from '../../assets/icon/back.png'

export default SafetyInductionOne = ({ navigation }) => {
  const safetyInductionText = `
  Anda sekarang berada dalam lingkungan PT PLN (Persero). Sebagai jalan keluar bila terjadi bencana dan pada dinding tembok dapat anda lihat rambu arah evakuasi.
Bila terjadi bencana atau ada alarm berbunyi dan perintah untuk dimulainya “EVAKUASI – EVAKUASI - EVAKUASI” maka aplikasi akan memandu anda keluar menuju ke titik kumpul yang aman
Pada saat prosedur evakuasi dimulai, kami mengingatkan agar anda semua
tetap tenang dan secara teratur mulai keluar dari ruangan ini melewati pintu
keluar terdekat. Dimulai dari anda yang berada paling dekat dengan pintu
keluar dan secara berurutan sampai anda yang berada paling jauh dari
pintu. Perhatikan dengan seksama perintah dan pemandu anda.

1) Selama proses evakuasi anda dilarang membawa barang terlalu banyak dan jangan pernah kembali lagi ke ruangan ini setelah anda berhasil keluar karena alasan apapun.

2) Apabila bahaya kebakaran yang terjadi, dan kondisi sumber api masih kecil maka siapapun anda yang mampu harus secepatnya mengoperasikan tabung APAR (alat pemadam api ringan) untuk memadamkan api.

3) Saat berjalan mengikuti pemandu atau rambu arah evakuasi, saat asap tebal anda harus berjalan sedikit merunduk/merendah agar pandangan lebih baik.

4) aplikasi akan memandu anda secara aman mengikuti panah arah evakuasi yang akan berakhir di area titik kumpul aman sementara.
`;

  const nextPageNavigate = () => {
    navigation.navigate('PageTwo')
  }
  

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: 'white', width: '100%', flexDirection: 'column' }}>
      <SafeAreaView style={{ height: '100%', }}>
        <View style={styles.container}>
          {/* <View style={styles.topNavigationWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => {navigation.pop()}}>
                <Image source={backIcon} style={styles.buttonIcon} />
            </TouchableOpacity>
          </View> */}
          <View style={styles.pageTitleWrapper}>
            <TouchableOpacity style={styles.pageIconContainer} >
                <Image source={checklistIcon} style={styles.pageIcon}/>
            </TouchableOpacity>
            <View>
              <Text style={styles.appTitleText}>Safety Induction</Text>
              <Text style={styles.appSubtitleText}>1/2</Text>
            </View>
          </View>
        </View>

        <View style={contentCardStyles.contentCard}>
          <View style={styles.containerFillHeight}>
            <View style={contentCardStyles.cardBody}>
                <Text style={{ color: 'black', textAlign: 'justify' }}>{safetyInductionText}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={contentCardStyles.nextPageButton} onPress={nextPageNavigate}>
                <Text style={contentCardStyles.nextPageText}>Selanjutnya</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>


      </SafeAreaView>
    </ScrollView>
  )
}

// Styles
const styles = StyleSheet.create({
  topNavigationWrapper: {
    flexDirection: 'column',
    gap: 20,
  },

  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'column',
    gap: 10,
  },
  
  containerFillHeight: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    flexDirection: 'column',
    gap: 10,
    flexGrow: 1,
  },
  
  pageContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'column',
    gap: 10,
    flexGrow: 1,
    backgroundColor: 'red',
  },


  button: {
    height: 38,
    width: 38,
    borderRadius: 19,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: '90%',
    height: '90%',
  },

  appLogoText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 4,
    color: 'white',
  },

  logoWrapper: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
    paddingVertical: 60,
  },

  pageTitleWrapper: {
    padding: 20,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  appTitleText: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 22,
    fontWeight: 700,
    color: 'black',
    letterSpacing: 2,
  },

  pageIconContainer: {
    backgroundColor: '#fff200',
    borderRadius: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  pageIcon: {
    width: '80%',
    height: '80%',
  }
})

const contentCardStyles = StyleSheet.create({
  contentCard: {
    width: '100%',
    minHeight: 420,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#F4F7FF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardBody: {
    flexDirection: 'column',
    gap: 10,
    flexGrow: 1,
  },
  formInput: {
    width: '100%',
    flexDirection: 'column',
    gap: 8,
    paddingVertical: 8,
  },
  formInputLabel: {
    color: 'black',
    fontWeight: 600,
  },
  formInputText: {
    color: 'black',
    fontSize: 16,
  },
  datetimeForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 20,
  },

  buttonWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingVertical: 20,
  },
  SubmitButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#FFF200',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  SubmitButtonText: {
    color: 'black',
    fontWeight: 700,
  },
  DangerButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#ed1c24',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  DangerButtonText: {
    color: 'white',
    fontWeight: 700,
  },
  AbortButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#222F34',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  AbortButtonText: {
    color: 'white',
    fontWeight: 700,
  },

  // Card Footer
  cardFooter: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  footerLogoContainer: {
    width: 40,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  footerLogo: {
    width: '100%',
    height: '100%',
  },
  footerLogoText: {
    fontWeight: '600',
    letterSpacing: 4,
  },

  nextPageButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'black',
    // backgroundColor: '#fff200',
    borderRadius: 8,
  },
  nextPageText: {
    color: 'white',
    fontWeight: '600'
  }
})