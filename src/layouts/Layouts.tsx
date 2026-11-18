import {Contact} from '../components/Contact.tsx'
import {Certificates, Education, Experience, Languages, ProfileAbout, ProfileHeader} from '../components/Profile.tsx'
import {ProjectGraph} from '../components/ProjectGraph.tsx'
import type {Layout} from '../settings.ts'

// Arrangements of the same blocks. The DOM order is the reading order on small screens, where every layout
// becomes a single column; CSS (`.layout-<name>` in src/index.css) places the blocks on wide screens.

/** One column: introduction, projects, the rest of the profile, contact. */
function Classic() {
    return (
        <>
            <ProfileHeader/>
            <ProfileAbout/>
            <ProjectGraph/>
            <Experience/>
            <Education/>
            <Certificates/>
            <Languages/>
            <Contact/>
        </>
    )
}

/** Short introduction, then the graph across the full width, then the CV in two columns. */
function Showcase() {
    return (
        <>
            <div className="showcase-hero">
                <ProfileHeader/>
                <ProfileAbout/>
            </div>
            <ProjectGraph className="showcase-graph"/>
            <div className="showcase-cv">
                <div>
                    <Experience/>
                </div>
                <div>
                    <Education/>
                    <Certificates/>
                    <Languages/>
                </div>
            </div>
            <Contact/>
        </>
    )
}

/** Who and how to reach in a sticky side column, the content beside it. */
function Sidebar() {
    return (
        <div className="sidebar-layout">
            <aside className="sidebar">
                <ProfileHeader/>
                <Languages/>
                <Contact/>
            </aside>
            <div className="sidebar-main">
                <ProfileAbout className="lead"/>
                <ProjectGraph/>
                <Experience/>
                <Education/>
                <Certificates/>
            </div>
        </div>
    )
}

/** The text scrolls on the left, the graph stays in view on the right. */
function Split() {
    return (
        <div className="split-layout">
            <div className="split-intro">
                <ProfileHeader/>
                <ProfileAbout/>
            </div>
            <div className="split-graph">
                <ProjectGraph/>
            </div>
            <div className="split-cv">
                <Experience/>
                <Education/>
                <Certificates/>
                <Languages/>
                <Contact/>
            </div>
        </div>
    )
}

/** Every block on its own tile, in a grid of different tile sizes. */
function Bento() {
    return (
        <div className="bento">
            <ProfileHeader className="tile tile-identity"/>
            <ProfileAbout className="tile tile-about"/>
            <ProjectGraph className="tile tile-graph"/>
            <Experience className="tile tile-experience"/>
            <Education className="tile tile-education"/>
            <Certificates className="tile tile-certificates"/>
            <Languages className="tile tile-languages"/>
            <Contact className="tile tile-contact"/>
        </div>
    )
}

const COMPONENTS = {
    classic: Classic,
    showcase: Showcase,
    sidebar: Sidebar,
    split: Split,
    bento: Bento,
} satisfies Record<Layout, () => React.JSX.Element>

export function PageContent({layout}: {layout: Layout}) {
    const Component = COMPONENTS[layout]
    return <Component/>
}
