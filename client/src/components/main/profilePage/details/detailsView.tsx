import React from "react";
import { UserProfileType } from "../../../../types/entityTypes";
import {
    FaMapMarkerAlt,
    FaGlobe,
    FaTwitter,
    FaGithub,
} from "react-icons/fa";
import "./detailsView.css";

// Cast the icons to React functional components with SVG props.
const MapMarkerIcon = FaMapMarkerAlt as React.FC<React.SVGProps<SVGSVGElement>>;
const GlobeIcon = FaGlobe as React.FC<React.SVGProps<SVGSVGElement>>;
const TwitterIcon = FaTwitter as React.FC<React.SVGProps<SVGSVGElement>>;
const GithubIcon = FaGithub as React.FC<React.SVGProps<SVGSVGElement>>;

/**
 * Props for the ProfileDetails component.
 * Contains user profile data to be displayed.
 */
interface ProfileDetailsProps {
    userProfile: UserProfileType;
}

/**
 * Displays detailed profile information for a user,
 * including bio, title, location, and social/media links.
 */
const ProfileDetails = ({ userProfile }: ProfileDetailsProps) => {
    return (
        <div className="profile_details_container">
            {/* Left Column: Display Name, Title, About Me */}
            <div className="profile_details_left">
                <h1 className="display_name">{userProfile.user.displayName}</h1>
                {userProfile.title && (
                    <span className="title_badge">{userProfile.title}</span>
                )}
                <p className="about_me">
                    {userProfile.aboutMe || "No about me provided."}
                </p>
            </div>

            {/* Right Column: Location & Links with Icons */}
            <div className="profile_details_right">
                {userProfile.location && (
                    <div className="info_line">
                        <MapMarkerIcon className="info_icon" />
                        <span>{userProfile.location}</span>
                    </div>
                )}
                {userProfile.website && (
                    <div className="info_line">
                        <GlobeIcon className="info_icon" />
                        <a href={userProfile.website} target="_blank" rel="noopener noreferrer">
                            Website
                        </a>
                    </div>
                )}
                {userProfile.twitter && (
                    <div className="info_line">
                        <TwitterIcon className="info_icon" />
                        <a href={userProfile.twitter} target="_blank" rel="noopener noreferrer">
                            Twitter
                        </a>
                    </div>
                )}
                {userProfile.github && (
                    <div className="info_line">
                        <GithubIcon className="info_icon" />
                        <a href={userProfile.github} target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileDetails;
