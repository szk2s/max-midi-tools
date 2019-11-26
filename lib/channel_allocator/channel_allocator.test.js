const { expect } = require('chai');
const Midi = require('jzz').MIDI;
const { randomInt } = require('mathjs');

const TARGET = 'channel_allocator';
const MIDI = 'midi';
const FIRST_CH = 'firstCh';
const NUMBER_OF_VOICES = 4;
const MAX_STATUS_BYTE = 0x90 + NUMBER_OF_VOICES - 1;

/**
 * @param {Array<number>} midiMessage
 */
const sendMidiMessage = (midiMessage) => {
  const receivedBytes = [];
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(receivedBytes), 300);
    maxAPI.addHandler(TARGET, (byte) => {
      receivedBytes.push(byte);
      if (receivedBytes.length >= midiMessage.length) {
        clearTimeout(timeout);
        maxAPI.removeHandlers(TARGET);
        resolve(receivedBytes);
      }
    });
    midiMessage.forEach(async (byte) => {
      await maxAPI.outlet({ [TARGET]: { [MIDI]: byte } });
    });
  });
};

const midiAPI = {
  send: sendMidiMessage,
  /**
   * @param pitch?
   * @param velocity?
   * @param channel? starts from 0
   * @return {Promise<Array<Array<number>>>}
   */
  async noteOnAndOff(pitch, velocity, channel) {
    const defaulted = {
      pitch: pitch | 60,
      velocity: velocity | 127,
      channel: channel | 0
    };
    const resForNoteOn = await this.send(
      Midi.noteOn(defaulted.channel, defaulted.pitch, defaulted.velocity)
    );
    const resForNoteOff = await this.send(
      Midi.noteOff(defaulted.channel, defaulted.pitch)
    );
    return [resForNoteOn, resForNoteOff];
  }
};

beforeEach('initilaize channel allocator', async () => {
  await maxAPI.outlet({ [TARGET]: { [MIDI]: 'stop' } });
  await maxAPI.outlet({ [TARGET]: { [FIRST_CH]: 1 } });
  for (let i = 0; i < 16; i++) {
    const received = await midiAPI.noteOnAndOff();
    if (received[0][0] === MAX_STATUS_BYTE) {
      return;
    }
  }
  throw new Error('Cannot initialize');
});

test('allocates noteOns to oldest channels', async () => {
  // TODO: repeat many times
  for (let i = 0; i < 3; i++) {
    const randomStatusByte = 0x90 + randomInt(0, 15);
    const expectedStatusByte = 0x90 + (i % NUMBER_OF_VOICES);
    const received = await midiAPI.send([randomStatusByte, 60, 60]);
    expect(received).to.deep.equal([expectedStatusByte, 60, 60]);
  }
});

test('allocates noteOn to empty channel', async () => {
  // Fill notes to channels except the last one
  for (let i = 0; i < NUMBER_OF_VOICES - 1; i++) {
    const randomStatusByte = 0x90 + randomInt(0, 15);
    await midiAPI.send([randomStatusByte, 60, 60]);
  }
  // expect note on to be allocated to the last channel
  const randomStatusByte = 0x90 + randomInt(0, 15);
  const expectedStatusByte = 0x90 + NUMBER_OF_VOICES - 1;
  const received = await midiAPI.send([randomStatusByte, 60, 60]);
  expect(received).to.deep.equal([expectedStatusByte, 60, 60]);
});
