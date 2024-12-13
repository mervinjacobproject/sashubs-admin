import { Typography } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import ReactSpeedometer from 'react-d3-speedometer'
import { AuthContext } from 'src/context/AuthContext'

const SpeedometerExample = ({ seoScoreData }: any) => {
  const maxValue = 100
  const minValue = 0
  const [currentValue, setCurrentValue] = useState(5)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [needleRotationAngle, setNeedleRotationAngle] = useState(-90)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { crawlDate }: any = useContext(AuthContext)

  const getScoreColor = (score: number) => {
    if (score < 35) {
      return 'red'
    } else if (score >= 35 && score <= 66) {
      return '#fd9810'
    } else {
      return 'green'
    }
  }

  const scoreColor = getScoreColor(currentValue)

  useEffect(() => {
    if (!seoScoreData || seoScoreData.length == 0 || seoScoreData === undefined) {
      setIsAnalyzing(true)
      setCurrentValue(5)
      setNeedleRotationAngle(-85)
    }
    if (seoScoreData !== undefined) {
      let startValue = currentValue
      const targetValue = seoScoreData
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
      animationIntervalRef.current = setInterval(() => {
        if (startValue < targetValue) {
          startValue += 1
          setCurrentValue(startValue)
          setIsAnalyzing(false)
          const angle = ((startValue - minValue) / (maxValue - minValue)) * 180 - 90
          setNeedleRotationAngle(angle)
        } else {
          if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current)
          }
        }
      }, 30)
    }
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
    }
  }, [seoScoreData, currentValue])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            borderRadius: '15px',
            padding: '20px',
            width: '450px',
            position: 'relative'
          }}
        >
          <ReactSpeedometer
            value={currentValue}
            maxValue={maxValue}
            minValue={minValue}
            segments={3}
            segmentColors={['#D3212C', '#FF980E', '#069C56']}
            needleTransitionDuration={400}
            textColor='#fff'
            width={250}
            height={250}
            needleHeightRatio={0}
            ringWidth={30}
            customSegmentStops={[]}
          />
          {/* Custom Arrow (Fixed Needle like a clock needle) */}
          <div
            style={{
              position: 'absolute',
              top: '49%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${needleRotationAngle}deg)`,
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '150px',
              height: '150px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '-3%',
                  left: '43.5%',
                  transform: `translate(-50%, -50%) rotate(235deg)`,
                  transformOrigin: 'center',
                  zIndex: 0,
                  width: '0',
                  height: '0',
                  borderLeft: '15px solid transparent',
                  borderRight: '15px solid transparent',
                  borderBottom: '24px solid #fbfafa'
                }}
              />
            </div>
          </div>
          {/* Show 'Analyzing' text if there is no seoScoreData.TotalScore */}
          {isAnalyzing && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#615bc8',
                zIndex: 10
              }}
            >
              Analyzing...
            </div>
          )}
          {/* Show seoScoreData.TotalScore in the center with dynamic color */}
          {!isAnalyzing && (
            <div
              style={{
                position: 'absolute',
                top: '49%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '32px',
                fontWeight: 'bold',
                color: scoreColor,
                zIndex: 5
              }}
            >
              {currentValue}%
            </div>
          )}
        </div>
        <div
          style={{
            position: 'relative',
            bottom: '29px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Typography>Last Crawled</Typography>
          <Typography
            sx={{
              width: '110px',
              borderRadius: '5px',
              padding: '0',
              boxShadow: '0 7px 15px 0 rgba(0, 0, 0, .13), 0 1px 4px 0 rgba(0, 0, 0, .11)',
              marginTop: '9px',
              color: 'green'
            }}
          >
            {crawlDate}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default SpeedometerExample
