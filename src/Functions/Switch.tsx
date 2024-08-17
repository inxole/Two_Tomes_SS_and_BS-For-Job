export type CoverSwitchSetup = {
    test_coverSwitch: boolean,
}

export class CoverSwitchManager {
    private state: CoverSwitchSetup

    constructor(initialState: CoverSwitchSetup) {
        this.state = initialState
    }

    // 現在の状態を返す
    getState(): CoverSwitchSetup {
        return this.state
    }

    // 状態を更新する
    setState(newState: Partial<CoverSwitchSetup>): void {
        this.state = { ...this.state, ...newState }
    }

    // 特定のプロパティ（例えばtest_coverSwitch）をトグルする
    toggleCoverSwitch(): void {
        this.state.test_coverSwitch = !this.state.test_coverSwitch
    }
}

export const initialState: CoverSwitchSetup = { test_coverSwitch: false }
export const coverSwitchManager = new CoverSwitchManager(initialState)

export const handleCoverSwitchToggle = () => {
    coverSwitchManager.toggleCoverSwitch()
}