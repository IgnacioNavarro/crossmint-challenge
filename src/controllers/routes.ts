import express from 'express';
import megaverseService from '../services/megaverseServiceImpl';

const routes = express.Router();

//test route
routes.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong!');
});


routes.post('/createmegaverse', async (_req, res) => {
  console.log('someone created the megaverse');

  try {
    const data = await megaverseService.createMegaverse();

    res.status(201).json({
      data: data,
      message: 'megaverse created'
    });
  } catch (error) {
    res.status(500).json({
      message: 'failed to create megaverse',
      e: error
    });
  }
}
);



routes.delete('/cleanmegaverse', async (_req, res) => {
  console.log('someone cleaned the megaverse');
  try {
    const data = await megaverseService.cleanMegaverse();
    res.status(200).json({
      data: data,
      message: 'megaverse cleaned'
    });
  } catch (error) {
    console.log(error);
  }
});


export default routes;