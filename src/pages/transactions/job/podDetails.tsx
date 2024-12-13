import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { useRouter } from 'next/router'
import AppSink from 'src/commonExports/AppSink'

export interface JobtPodInfoMethods {
  childMethod: (id: any) => void
}

interface jobtaskProps {
  ref: any
  jobId: number
  handleNext: () => void
}

const JobPodDetails: React.FC<jobtaskProps> = forwardRef<JobtPodInfoMethods, jobtaskProps>(({ handleNext }, ref) => {
  const router = useRouter()
  const { id: routerId } = router.query
  const [expanded, setExpanded] = useState<string | false>(false)
  const [items, setItems] = useState([])
  const [images, setImages] = useState([]) 

  const handleChange = (panel: string, itemUID: string) => async (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
    if (isExpanded) {
      await fetchParticularImage(itemUID)
    }
  }

  const fetchData = async () => {
    const query = `query MyQuery {
      listPODSettings5AABS(filter: {Status: {eq: true}}) {
        items {
          CreatedDate
          LastModified
          Order
          PODName
          Status
          UID
        }
      }
    }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setItems(res.data.data.listPODSettings5AABS.items)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchParticularImage = async (itemUID: string) => {
    const query = `
        query MyQuery {
          listDriverImage5AABS(filter: {JobId: {eq: ${routerId}}, PodId: {eq:${itemUID}}}) {
            items {
              Date
              EmpId
              ID
              Image
              ImageName
              JobId
              PodId
            }
          }
        }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setImages(res.data.data.listDriverImage5AABS.items) // Update images state with fetched images
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useImperativeHandle(ref, () => ({
    async childMethod() {
      handleNext()
    }
  }))

  return (
    <>
      <form>
        {items.map((item: any, index: number) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`, item.UID)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Typography sx={{ color: 'text.secondary' }}>{item.PODName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                {images.map((imageItem: any, j: number) => (
                  <div key={j}>
                    <img
                      style={{ width: '200px', height: '200px', borderRadius: '10px' }}
                      src={imageItem.Image}
                      alt={`Image ${j}`}
                    />
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </form>
    </>
  )
})

export default JobPodDetails
