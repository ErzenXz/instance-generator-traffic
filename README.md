# Instance Generator for Google Hash Code Problem - Traffic Signaling

## Introduction

This is a Markdown (.md) file that serves as documentation for an instance generator designed to create input files for the Google Hash Code Problem - Traffic Signaling. The instance generator is a tool that creates instances of the problem based on user-defined parameters.

## Problem Statement

The Traffic Signaling problem involves creating an optimal schedule for traffic lights at intersections in a city. The goal is to minimize the total waiting time for all vehicles in the city.

The input for the problem consists of:

-  The duration of the simulation
-  The number of intersections
-  The number of streets
-  The number of cars
-  The duration of each street
-  The time it takes for a car to travel from one end of a street to the other
-  The streets that each car will travel on

The output for the problem consists of:

-  The number of intersections with traffic lights
-  The schedule for each traffic light, consisting of the street names and the duration of each green light

## Instance Generator

The instance generator is designed to create input files for the Traffic Signaling problem based on user-defined parameters. The user can specify the following parameters:

-  The number of intersections
-  The number of streets
-  The number of cars
-  The duration of the simulation

The generator creates a random graph of intersections and streets, where each street has a random duration and a random travel time. The generator also randomly assigns streets to cars.

## Usage

To use the instance generator, follow these steps:

1. Clone or download the repository containing the instance generator.
2. Install the necessary dependencies by running `pip install -r requirements.txt`.
3. Run the `generate_instance.py` script.
4. Follow the prompts to specify the parameters for the instance.
5. The generator will output an input file in the format specified by the problem statement.

Or go to the link below.

[Traffic Signaling Online](https://trafficsignaling.instance.generator.erzen.tk "Traffic Signaling Instance Generator")

## Conclusion

The instance generator is a useful tool for creating input files for the Traffic Signaling problem. By allowing users to specify parameters, the generator can create a wide variety of instances for testing and benchmarking algorithms.
