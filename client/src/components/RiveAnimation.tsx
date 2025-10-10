import { useRive } from "@rive-app/react-canvas";

interface RiveAnimationProps {
  stateMachine?: string;
  artboard?: string;
  autoplay?: boolean;
  onLoad?: () => void;
}

export default function RiveAnimation({ 
  stateMachine = "State Machine 1",
  artboard,
  autoplay = true,
  onLoad
}: RiveAnimationProps) {
  const { RiveComponent, rive } = useRive({
    src: "/attached_assets/coco_1760095148906.riv",
    stateMachines: stateMachine,
    artboard: artboard,
    autoplay: autoplay,
    onLoad: () => {
      if (onLoad) onLoad();
      if (rive) {
        const inputs = rive.stateMachineInputs(stateMachine);
        const loadingTrigger = inputs?.find(i => i.name === "Loading");
        if (loadingTrigger) {
          loadingTrigger.fire();
        }
      }
    },
  });

  const triggerVoiceStarts = () => {
    if (rive) {
      const inputs = rive.stateMachineInputs(stateMachine);
      const voiceStartsTrigger = inputs?.find(i => i.name === "voice starts");
      if (voiceStartsTrigger) {
        voiceStartsTrigger.fire();
      }
    }
  };

  return {
    RiveComponent,
    rive,
    triggerVoiceStarts
  };
}
