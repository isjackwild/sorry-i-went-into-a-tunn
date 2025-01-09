const PoorSignalWorklet = `
class PoorSignalWorklet extends AudioWorkletProcessor {
  static quantize(value, step) {
    return Math.round(value / step) * step;
  }
  
  static get parameterDescriptors() {
    return [
      {
        name: 'signal', 
        defaultValue: 1, 
        minValue: 0, 
        maxValue: 1 
      }
    ];
  }

  /**
   * @param inputs Float32Array[][] [input#][channel#][sample#] so to access first inputs 1st channel inputs[0][0]
   * @param outputs Float32Array[][]
   */
  process(inputs, outputs, parameters) {
    const oneMinusSignal = 1 - parameters["signal"][0]
    if (oneMinusSignal > 0.8) {
      for (let i = 0; i < outputs[0][0].length; i++) {
        outputs[0][0][i] = 0
      }
      return true
    }

    const input = inputs[0]
    const inputChannel = input[0]
    if (input.length === 0 || inputChannel.length === 0) {
      return true
    }
    
    const step = 1 + Math.round(oneMinusSignal * 12);
    for (let i = 0; i < outputs[0][0].length; i += step) {
      for (let j = 0; j < step; j++) {
        if (i + j < outputs[0][0].length) {
          outputs[0][0][i + j] = PoorSignalWorklet.quantize(inputChannel[i], 0.5 * Math.max(0.01, oneMinusSignal))
        }
      }
    }

    return true;
  }
}
`;

export default PoorSignalWorklet;
