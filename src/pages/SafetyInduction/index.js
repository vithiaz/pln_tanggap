import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'

import checklistIcon from '../../assets/icon/checklist.png'
import backIcon from '../../assets/icon/back.png'

export default SafetyInduction = ({ navigation }) => {
  const safetyInductionText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vulputate risus velit, eget malesuada enim finibus ut. Ut eleifend vitae dui ac dignissim. Integer erat est, dignissim sit amet interdum quis, finibus eget velit. Nullam lectus tortor, pulvinar non aliquet sit amet, malesuada sit amet enim. Praesent diam lacus, rutrum quis lobortis sed, aliquet gravida nunc. Maecenas nec orci id tellus tempor facilisis. Fusce iaculis est eget sapien facilisis, at ullamcorper lacus consequat. Quisque varius consequat ex non volutpat. Etiam eu velit sed sem auctor facilisis. Nullam maximus condimentum enim.
Etiam id tellus in nulla sollicitudin fermentum. Phasellus non turpis iaculis, hendrerit lacus in, sagittis augue. Donec vel hendrerit ex, ac consequat enim. Vivamus lorem eros, finibus in orci a, ornare gravida justo. Suspendisse vel fringilla diam. Pellentesque nec ex libero. Sed eleifend porta erat eu ullamcorper. Proin vestibulum quam a quam cursus feugiat in eu quam. Maecenas at mi ipsum. Aenean elementum sapien sem, sit amet volutpat massa imperdiet eu. Aenean cursus congue efficitur. Etiam pharetra non est tempus pellentesque. In hac habitasse platea dictumst. Sed scelerisque, erat id commodo varius, leo lacus aliquet turpis, sit amet euismod lacus enim eu turpis. Quisque convallis facilisis mauris, a consequat magna scelerisque id. Vivamus consequat hendrerit ipsum, et facilisis lectus.
Aenean fermentum non libero eu porttitor. Ut gravida magna a est tempor tincidunt. Nam interdum ornare erat ac mollis. Vivamus placerat interdum eros eu hendrerit. In egestas eu nulla a hendrerit. Aliquam posuere porttitor lorem. Cras rhoncus sem ut lacinia scelerisque. Morbi scelerisque, nunc in lacinia imperdiet, felis tortor fringilla elit, eu bibendum ipsum metus tempus ligula. Pellentesque at consectetur ex. Quisque imperdiet lobortis maximus. Praesent ex felis, gravida eu erat ut, maximus luctus tortor. Donec maximus quis nisi at tristique. Fusce ligula nisl, tristique eget tellus dignissim, varius cursus sapien. Fusce ante diam, imperdiet a risus non, commodo vulputate leo. Duis volutpat eu dui eu rhoncus. Praesent sit amet mollis felis.
`;
  

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: 'white', width: '100%', flexDirection: 'column' }}>
      <SafeAreaView style={{ height: '100%', }}>
        <View style={styles.container}>
          <View style={styles.topNavigationWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => {navigation.pop()}}>
                <Image source={backIcon} style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.pageTitleWrapper}>
            <Text style={styles.appTitleText}>Safety Induction</Text>
            <TouchableOpacity style={styles.pageIconContainer} >
                <Image source={checklistIcon} style={styles.pageIcon}/>
            </TouchableOpacity>
          </View>
        </View>

        <View style={contentCardStyles.contentCard}>
          <View style={styles.containerFillHeight}>
            <View style={contentCardStyles.cardBody}>
                <Text style={{ color: 'black', textAlign: 'justify' }}>{safetyInductionText}</Text>
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
    paddingVertical: 20,
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
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
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
  }
})