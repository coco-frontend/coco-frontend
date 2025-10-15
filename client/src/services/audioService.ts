import { AUDIO_CONFIG } from '@/lib/constants';

/**
 * Audio service for managing microphone input and audio processing
 */
export class AudioService {
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private stream: MediaStream | null = null;
  private onAudioData: ((data: ArrayBuffer) => void) | null = null;
  private isPaused = false;

  async startRecording(onData: (data: ArrayBuffer) => void): Promise<void> {
    this.onAudioData = onData;

    // Request microphone with PCM settings
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
      },
    });

    // Create audio context
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
    });

    const source = this.audioContext.createMediaStreamSource(this.stream);
    this.processor = this.audioContext.createScriptProcessor(
      AUDIO_CONFIG.BUFFER_SIZE,
      AUDIO_CONFIG.CHANNELS,
      AUDIO_CONFIG.CHANNELS
    );

    source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);

    this.processor.onaudioprocess = (e) => {
      if (this.isPaused || !this.onAudioData) return;

      // Get PCM data
      const inputData = e.inputBuffer.getChannelData(0);

      // Convert Float32Array to Int16Array (PCM 16-bit)
      const pcm16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }

      this.onAudioData(pcm16.buffer);
    };
  }

  pause(): void {
    this.isPaused = true;
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend();
    }
  }

  resume(): void {
    this.isPaused = false;
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  async stopRecording(): Promise<void> {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.onAudioData = null;
    this.isPaused = false;
  }
}
